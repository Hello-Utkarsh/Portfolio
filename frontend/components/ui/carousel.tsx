'use client';
import {
    Children,
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { motion, Transition, useMotionValue } from 'motion/react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { TextAnimate } from './text-animate';

export type CarouselContextType = {
    index: number;
    setIndex: (newIndex: number) => void;
    itemsCount: number;
    setItemsCount: (newItemsCount: number) => void;
    disableDrag: boolean;
};

const CarouselContext = createContext<CarouselContextType | undefined>(
    undefined
);

function useCarousel() {
    const context = useContext(CarouselContext);
    if (!context) {
        throw new Error('useCarousel must be used within an CarouselProvider');
    }
    return context;
}

export type CarouselProviderProps = {
    children: ReactNode;
    initialIndex?: number;
    onIndexChange?: (newIndex: number) => void;
    disableDrag?: boolean;
};

function CarouselProvider({
    children,
    initialIndex = 0,
    onIndexChange,
    disableDrag = false,
}: CarouselProviderProps) {
    const [index, setIndex] = useState<number>(initialIndex);
    const [itemsCount, setItemsCount] = useState<number>(0);

    const handleSetIndex = (newIndex: number) => {
        setIndex(newIndex);
        onIndexChange?.(newIndex);
    };

    useEffect(() => {
        setIndex(initialIndex);
    }, [initialIndex]);

    return (
        <CarouselContext.Provider
            value={{
                index,
                setIndex: handleSetIndex,
                itemsCount,
                setItemsCount,
                disableDrag,
            }}
        >
            {children}
        </CarouselContext.Provider>
    );
}

export type CarouselProps = {
    children: ReactNode;
    className?: string;
    initialIndex?: number;
    index?: number;
    onIndexChange?: (newIndex: number) => void;
    disableDrag?: boolean;
};

function Carousel({
    children,
    className,
    initialIndex = 0,
    index: externalIndex,
    onIndexChange,
    disableDrag = false,
}: CarouselProps) {
    const [internalIndex, setInternalIndex] = useState<number>(initialIndex);
    const isControlled = externalIndex !== undefined;
    const currentIndex = isControlled ? externalIndex : internalIndex;

    const handleIndexChange = (newIndex: number) => {
        if (!isControlled) {
            setInternalIndex(newIndex);
        }
        onIndexChange?.(newIndex);
    };

    return (
        <CarouselProvider
            initialIndex={currentIndex}
            onIndexChange={handleIndexChange}
            disableDrag={disableDrag}
        >
            <div className={cn('group/hover relative', className)}>
                <div className='overflow-hidden h-full flex flex-col gap-8'>{children}</div>
            </div>
        </CarouselProvider>
    );
}

export type CarouselNavigationProps = {
    className?: string;
    classNameButton?: string;
    alwaysShow?: boolean;
};

function CarouselNavigation({
    className,
    classNameButton,
    alwaysShow,
}: CarouselNavigationProps) {
    const { index, setIndex, itemsCount } = useCarousel();

    return (
        <div
            className={cn(
                'absolute pointer-events-none w-full flex mx-auto justify-between px-2',
                className
            )}
        >
            <button
                type='button'
                aria-label='Previous slide'
                className={cn(
                    'pointer-events-auto cursor-pointer flex h-fit w-fit rounded-full bg-zinc-900 p-2 transition-opacity duration-300 dark:bg-zinc-950',
                    alwaysShow
                        ? 'opacity-100'
                        : 'opacity-0 group-hover/hover:opacity-100',
                    alwaysShow
                        ? 'disabled:opacity-40'
                        : 'group-hover/hover:disabled:opacity-40',
                    classNameButton
                )}
                disabled={index === 0}
                onClick={() => {
                    if (index > 0) {
                        setIndex(index - 1);
                    }
                }}
            >
                <ChevronLeft
                    className='stroke-zinc-100 dark:stroke-zinc-50 pointer-events-none'
                    size={16}
                />
            </button>
            <button
                type='button'
                className={cn(
                    'pointer-events-auto cursor-pointer h-fit w-fit rounded-full bg-zinc-900 p-2 transition-opacity duration-300 dark:bg-zinc-950',
                    alwaysShow
                        ? 'opacity-100'
                        : 'opacity-0 group-hover/hover:opacity-100',
                    alwaysShow
                        ? 'disabled:opacity-40'
                        : 'group-hover/hover:disabled:opacity-40',
                    classNameButton
                )}
                aria-label='Next slide'
                disabled={index + 1 === itemsCount}
                onClick={() => {
                    if (index < itemsCount - 1) {
                        setIndex(index + 1);
                    }
                }}
            >
                <ChevronRight
                    className='stroke-zinc-100 dark:stroke-zinc-50'
                    size={16}
                />
            </button>
        </div>
    );
}

export type CarouselIndicatorProps = {
    className?: string;
    classNameButton?: string;
};

function CarouselIndicator({
    className,
    classNameButton,
}: CarouselIndicatorProps) {
    const { index, itemsCount, setIndex } = useCarousel();

    return (
        <div
            className={cn(
                'z-10 flex w-full items-center justify-center',
                className
            )}
        >
            <div className='flex space-x-2'>
                {Array.from({ length: itemsCount }, (_, i) => (
                    <button
                        key={i}
                        type='button'
                        aria-label={`Go to slide ${i + 1}`}
                        onClick={() => setIndex(i)}
                        className={cn(
                            'h-2 w-2 rounded-full transition-opacity duration-300',
                            index === i
                                ? 'bg-zinc-400 dark:bg-zinc-50'
                                : 'bg-gray-300/30 dark:bg-zinc-100/50',
                            classNameButton
                        )}
                    />
                ))}
            </div>
        </div>
    );
}

export type CarouselContentProps = {
    children: ReactNode;
    className?: string;
    transition?: Transition;
};

function CarouselContent({
    children,
    className,
    transition,
}: CarouselContentProps) {
    const { index, setIndex, setItemsCount, disableDrag } = useCarousel();
    const [visibleItemsCount, setVisibleItemsCount] = useState(1);
    const dragX = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const itemsLength = Children.count(children);

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const options = {
            root: containerRef.current,
            threshold: 0.5,
        };

        const observer = new IntersectionObserver((entries) => {
            const visibleCount = entries.filter(
                (entry) => entry.isIntersecting
            ).length;
            setVisibleItemsCount(visibleCount);
        }, options);

        const childNodes = containerRef.current.children;
        Array.from(childNodes).forEach((child) => observer.observe(child));

        return () => observer.disconnect();
    }, [children, setItemsCount]);

    useEffect(() => {
        if (!itemsLength) {
            return;
        }

        setItemsCount(itemsLength);
    }, [itemsLength, setItemsCount]);

    const onDragEnd = () => {
        const x = dragX.get();

        if (x <= -10 && index < itemsLength - 1) {
            setIndex(index + 1);
        } else if (x >= 10 && index > 0) {
            setIndex(index - 1);
        }
    };

    return (
        <motion.div
            drag={disableDrag ? false : 'x'}
            dragConstraints={
                disableDrag
                    ? undefined
                    : {
                        left: 0,
                        right: 0,
                    }
            }
            dragMomentum={disableDrag ? undefined : false}
            style={{
                x: disableDrag ? undefined : dragX,
            }}
            animate={{
                translateX: `-${index * (100 / visibleItemsCount)}%`,
            }}
            onDragEnd={disableDrag ? undefined : onDragEnd}
            transition={
                transition || {
                    damping: 18,
                    stiffness: 90,
                    type: 'spring',
                    duration: 0.2,
                }
            }
            className={cn(
                'flex items-center',
                !disableDrag && 'cursor-grab active:cursor-grabbing',
                className
            )}
            ref={containerRef}
        >
            {children}
        </motion.div>
    );
}

export type CarouselItemProps = {
    children: ReactNode;
    className?: string;
};

function CarouselItem({ children, className }: CarouselItemProps) {
    return (
        <motion.div
            className={cn(
                'w-full min-w-0 shrink-0 grow-0 overflow-hidden',
                className
            )}
        >
            {children}
        </motion.div>
    );
}

export default function ProjectCarousel({ theme }: { theme: 'dark' | 'light' }) {
    const video = useRef<HTMLVideoElement>(null)
    const [isPaused, setIsPaused] = useState(true);

    return (
        <div className='mx-auto h-full'>
            <Carousel className='h-full'>
                <CarouselContent className='h-full'>
                    <CarouselItem className='h-full'>
                        <div

                            className='flex flex-col group relative h-full overflow-hidden rounded-lg text-white items-center border border-[#212121]'>
                            <video onMouseEnter={() => {
                                video.current?.play()
                                setIsPaused(false)
                            }}
                                onMouseLeave={() => {
                                    video.current?.pause()
                                    setIsPaused(true)
                                }} ref={video} className="w-full py-1 transition-all duration-300 absolute top-0" src="/autodocs.webm" />
                            {isPaused && <div className='flex flex-col h-full self-start rounded-lg backdrop-blur-sm bg-gray-400/15 px-4 z-10 py-12 tracking-tighter w-4/12 text-black'>
                                <TextAnimate animation="blurInUp" by="character" delay={0.5} className='text-7xl font-bebas tracking-wide' once>AutoDocs</TextAnimate>
                                <span className='flex gap-2 items-center'>
                                    <svg role="img" viewBox="0 0 24 24" width={24} height={24} className='fill-[#61DAFB]' xmlns="http://www.w3.org/2000/svg"><title>React</title><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" /></svg>
                                    <svg role="img" viewBox="0 0 24 24" width={24} height={24} style={{ fill: theme }} xmlns="http://www.w3.org/2000/svg"><title>Express</title><path d="M24 18.588a1.529 1.529 0 01-1.895-.72l-3.45-4.771-.5-.667-4.003 5.444a1.466 1.466 0 01-1.802.708l5.158-6.92-4.798-6.251a1.595 1.595 0 011.9.666l3.576 4.83 3.596-4.81a1.435 1.435 0 011.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 000 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27 1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.078 4.078 0 002.582-2.876c.207-.666.548-.78 1.174-.588a5.417 5.417 0 01-2.589 3.957 6.272 6.272 0 01-7.306-.933 6.575 6.575 0 01-1.64-3.858c0-.235-.08-.455-.134-.666A88.33 88.33 0 010 11.577zm1.127-.286h9.654c-.06-3.076-2.001-5.258-4.59-5.278-2.882-.04-4.944 2.094-5.071 5.264z" /></svg>
                                    <svg role="img" viewBox="0 0 24 24" width={24} height={24} style={{ fill: theme }} xmlns="http://www.w3.org/2000/svg"><title>Prisma</title><path d="M21.8068 18.2848L13.5528.7565c-.207-.4382-.639-.7273-1.1286-.7541-.5023-.0293-.9523.213-1.2062.6253L2.266 15.1271c-.2773.4518-.2718 1.0091.0158 1.4555l4.3759 6.7786c.2608.4046.7127.6388 1.1823.6388.1332 0 .267-.0188.3987-.0577l12.7019-3.7568c.3891-.1151.7072-.3904.8737-.7553s.1633-.7828-.0075-1.1454zm-1.8481.7519L9.1814 22.2242c-.3292.0975-.6448-.1873-.5756-.5194l3.8501-18.4386c.072-.3448.5486-.3996.699-.0803l7.1288 15.138c.1344.2856-.019.6224-.325.7128z" /></svg>
                                    <svg role="img" viewBox="0 0 24 24" width={24} height={24} className="fill-[#5FA04E]" xmlns="http://www.w3.org/2000/svg"><title>Node.js</title><path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z" /></svg>
                                </span>
                                <p className='text-base mt-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam blanditiis enim doloremque explicabo repellat facere dolores ipsam quos magnam fugiat.</p>
                                <div className='grid grid-cols-2 gap-3 mt-2'>
                                    <span className='border border-gray-700 rounded-md p-2'>
                                        <p className='text-sm font-bold'>Feature</p>
                                        <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, necessitatibus.</p>
                                    </span>
                                    <span className='border border-gray-700 rounded-md p-2'>
                                        <p className='text-sm font-bold'>Feature</p>
                                        <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, necessitatibus.</p>
                                    </span>
                                    <span className='border border-gray-700 rounded-md p-2'>
                                        <p className='text-sm font-bold'>Feature</p>
                                        <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, necessitatibus.</p>
                                    </span>
                                    <span className='border border-gray-700 rounded-md p-2'>
                                        <p className='text-sm font-bold'>Feature</p>
                                        <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, necessitatibus.</p>
                                    </span>
                                </div>
                                <div className='flex gap-2 mt-4'>
                                    <svg role="img" viewBox="0 0 24 24" width={30} height={30} className='fill-[#181717]' xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" color="currentColor" fill="none">
                                        <defs></defs>
                                        <path fill="currentColor" d="M19.986,4.014 C22.338,6.366 22.338,10.179 19.986,12.53 L17.377,15.14 C17.084,15.433 16.609,15.433 16.316,15.14 C16.023,14.847 16.023,14.372 16.316,14.079 L18.926,11.47 C20.691,9.704 20.691,6.84 18.926,5.074 C17.16,3.309 14.296,3.309 12.53,5.074 L9.921,7.684 C9.628,7.977 9.153,7.977 8.86,7.684 C8.567,7.391 8.567,6.916 8.86,6.623 L11.47,4.014 C13.821,1.662 17.634,1.662 19.986,4.014 Z M7.684,9.921 L5.074,12.53 C3.309,14.296 3.309,17.16 5.074,18.926 C6.84,20.691 9.704,20.691 11.47,18.926 L14.079,16.316 C14.372,16.023 14.847,16.023 15.14,16.316 C15.433,16.609 15.433,17.084 15.14,17.377 L12.53,19.986 C10.179,22.338 6.366,22.338 4.014,19.986 C1.662,17.634 1.662,13.821 4.014,11.47 L6.623,8.86 C6.916,8.567 7.391,8.567 7.684,8.86 C7.977,9.153 7.977,9.628 7.684,9.921 Z M15.03,10.03 L10.03,15.03 C9.737,15.323 9.263,15.323 8.97,15.03 C8.677,14.737 8.677,14.263 8.97,13.97 L13.97,8.97 C14.263,8.677 14.737,8.677 15.03,8.97 C15.323,9.263 15.323,9.737 15.03,10.03 Z"></path>
                                    </svg>
                                </div>
                            </div>}
                        </div>
                    </CarouselItem>
                    <CarouselItem className='h-full'>
                        <div className='flex h-full rounded-lg text-white items-center justify-center border border-zinc-200 dark:border-zinc-800'>
                            2
                        </div>
                    </CarouselItem>
                    <CarouselItem className='h-full'>
                        <div className='flex h-full rounded-lg text-white items-center justify-center border border-zinc-200 dark:border-zinc-800'>
                            3
                        </div>
                    </CarouselItem>
                    <CarouselItem className='h-full'>
                        <div className='flex h-full rounded-lg text-white items-center justify-center border border-zinc-200 dark:border-zinc-800'>
                            4
                        </div>
                    </CarouselItem>
                </CarouselContent>
                <span className='flex absolute bottom-0 right-0 mr-1.5 w-48 z-20 p-2 min-h-10 self-center items-center'>
                    <CarouselNavigation alwaysShow />
                    <CarouselIndicator />
                </span>
            </Carousel>
        </div>
    );
}
