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
import { ExpressIcon, GithubIcon, NodeIcon, PrismaIcon, ReactIcon } from '../Icons';
import { ThemeConfig } from '@/lib/definition';

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

export default function ProjectCarousel({ theme, selected }: { theme: ThemeConfig, selected: 'dark' | 'light' }) {
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
                            {isPaused && <div className='flex flex-col h-full self-start rounded-lg backdrop-blur-sm bg-gray-400/15 px-4 z-10 py-12 tracking-tighter w-5/12 lg:w-4/12 text-black overflow-y-auto'>
                                <TextAnimate animation="blurInUp" by="character" delay={0.5} className='text-5xl lg:text-[3.5rem] xl:text-7xl font-bebas tracking-wide' once>AutoDocs</TextAnimate>
                                <span className='grid grid-cols-4 h-5 w-28 lg:h-6 lg:w-32'>
                                    <ReactIcon />
                                    <ExpressIcon fillColor={"black"} />
                                    <PrismaIcon fillColor={"black"} />
                                    <NodeIcon />
                                </span>
                                <p className='text-sm xl:text-base mt-4 lg:mt-6' style={{ color: theme[selected].secondaryText }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam blanditiis enim doloremque explicabo repellat facere dolores ipsam quos magnam fugiat.</p>
                                <div className='grid grid-cols-2 gap-3 mt-2'>
                                    <span className='border border-gray-700 rounded-md p-2'>
                                        <p className='text-xs xl:text-sm font-bold'>Feature</p>
                                        <p className='text-xs xl:text-sm' style={{ color: theme[selected].secondaryText }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, necessitatibus.</p>
                                    </span>
                                    <span className='border border-gray-700 rounded-md p-2'>
                                        <p className='text-xs xl:text-sm font-bold'>Feature</p>
                                        <p className='text-xs xl:text-sm' style={{ color: theme[selected].secondaryText }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, necessitatibus.</p>
                                    </span>
                                    <span className='border border-gray-700 rounded-md p-2'>
                                        <p className='text-xs xl:text-sm font-bold'>Feature</p>
                                        <p className='text-xs xl:text-sm' style={{ color: theme[selected].secondaryText }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, necessitatibus.</p>
                                    </span>
                                    <span className='border border-gray-700 rounded-md p-2'>
                                        <p className='text-xs xl:text-sm font-bold'>Feature</p>
                                        <p className='text-xs xl:text-sm' style={{ color: theme[selected].secondaryText }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, necessitatibus.</p>
                                    </span>
                                </div>
                                <div className='flex gap-2 mt-4'>
                                    <GithubIcon theme={theme} selected={selected} />
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
