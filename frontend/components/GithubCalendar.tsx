import { GitHubCalendar } from 'react-github-calendar'

export default function GithubCalendar() {
  return (
    <div>
      <GitHubCalendar blockSize={8} fontSize={14} showTotalCount={false} showWeekdayLabels={false} showColorLegend={false} username="Hello-Utkarsh" className="h-fit w-fit overflow-x-scroll" />
    </div>
  )
}
