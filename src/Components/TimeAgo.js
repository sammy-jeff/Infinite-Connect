import React from 'react'
import { fullDate, timeAgo, toDate } from '../helpers/timeAgo'

function TimeAgo({ value }) {
  const date = toDate(value)
  if (!date) return null
  return (
    <time dateTime={date.toISOString()} title={fullDate(date)}>
      {timeAgo(date)}
    </time>
  )
}

export default TimeAgo
