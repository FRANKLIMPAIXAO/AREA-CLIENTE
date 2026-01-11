'use client'

import { useState, useEffect } from 'react'
import { BellIcon } from '@heroicons/react/24/outline'
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid'
import { createClient } from '@/utils/supabase/client'

interface Notification {
    id: string
    title: string
    message: string
    link: string | null
    read: boolean
    created_at: string
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const supabase = createClient()

    async function fetchNotifications() {
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10)

        if (data) {
            setNotifications(data)
            setUnreadCount(data.filter(n => !n.read).length)
        }
    }

    useEffect(() => {
        fetchNotifications()

        // Subscribe to new notifications
        const channel = supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                },
                () => {
                    fetchNotifications()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    async function markAsRead(id: string) {
        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', id)

        fetchNotifications()
    }

    async function markAllAsRead() {
        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('read', false)

        fetchNotifications()
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
                {unreadCount > 0 ? (
                    <>
                        <BellIconSolid className="h-6 w-6 text-indigo-600" />
                        <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </>
                ) : (
                    <BellIcon className="h-6 w-6" />
                )}
            </button>

            {showDropdown && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 z-20 mt-2 w-80 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="p-4 border-b">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-900">Notificações</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-indigo-600 hover:text-indigo-500"
                                    >
                                        Marcar todas como lidas
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-indigo-50' : ''
                                            }`}
                                        onClick={() => {
                                            markAsRead(notif.id)
                                            if (notif.link) {
                                                window.location.href = notif.link
                                            }
                                        }}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {notif.title}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500">{notif.message}</p>
                                                <p className="mt-1 text-xs text-gray-400">
                                                    {new Date(notif.created_at).toLocaleString('pt-BR')}
                                                </p>
                                            </div>
                                            {!notif.read && (
                                                <div className="h-2 w-2 rounded-full bg-indigo-600" />
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-sm text-gray-500">
                                    Nenhuma notificação
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
