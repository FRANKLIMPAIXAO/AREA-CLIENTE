'use client'

import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface DueDocument {
    id: string
    name: string
    due_date: string
    type: string
    company: { name: string }
}

interface CalendarProps {
    documents: DueDocument[]
}

export default function DueDatesCalendar({ documents }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date())

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Group documents by date
    const documentsByDate = documents.reduce((acc, doc) => {
        const date = new Date(doc.due_date).getDate()
        if (!acc[date]) acc[date] = []
        acc[date].push(doc)
        return acc
    }, {} as Record<number, DueDocument[]>)

    function previousMonth() {
        setCurrentDate(new Date(year, month - 1))
    }

    function nextMonth() {
        setCurrentDate(new Date(year, month + 1))
    }

    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]

    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

    const today = new Date()
    const isToday = (day: number) => {
        return day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
    }

    const isPast = (day: number) => {
        const date = new Date(year, month, day)
        return date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    {monthNames[month]} {year}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={previousMonth}
                        className="p-2 hover:bg-gray-100 rounded"
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-100 rounded"
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                {/* Day headers */}
                {dayNames.map((day) => (
                    <div
                        key={day}
                        className="bg-gray-50 p-2 text-center text-xs font-semibold text-gray-600"
                    >
                        {day}
                    </div>
                ))}

                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDay }).map((_, index) => (
                    <div key={`empty-${index}`} className="bg-white p-2 h-24" />
                ))}

                {/* Days of month */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1
                    const docs = documentsByDate[day] || []
                    const hasDocuments = docs.length > 0

                    return (
                        <div
                            key={day}
                            className={`bg-white p-2 h-24 relative ${isToday(day) ? 'ring-2 ring-indigo-500' : ''
                                } ${isPast(day) ? 'opacity-50' : ''}`}
                        >
                            <div className="text-right">
                                <span
                                    className={`text-sm ${isToday(day)
                                            ? 'bg-indigo-600 text-white rounded-full px-2 py-1'
                                            : isPast(day)
                                                ? 'text-gray-400'
                                                : 'text-gray-900'
                                        }`}
                                >
                                    {day}
                                </span>
                            </div>

                            {/* Documents */}
                            {hasDocuments && (
                                <div className="mt-1 space-y-1">
                                    {docs.slice(0, 2).map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="text-[10px] bg-red-100 text-red-800 rounded px-1 py-0.5 truncate"
                                            title={`${doc.name} - ${doc.company.name}`}
                                        >
                                            {doc.type === 'guia' ? '📋' : '📄'} {doc.company.name}
                                        </div>
                                    ))}
                                    {docs.length > 2 && (
                                        <div className="text-[10px] text-gray-500">
                                            +{docs.length - 2} mais
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-indigo-600 rounded" />
                    Hoje
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-100 rounded" />
                    Vencimentos
                </div>
            </div>
        </div>
    )
}
