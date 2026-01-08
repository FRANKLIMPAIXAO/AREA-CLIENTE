import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export default function HomeScreen({ session }: { session: Session }) {
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState<{ full_name: string } | null>(null)

    useEffect(() => {
        if (session) getProfile()
    }, [session])

    async function getProfile() {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`full_name`)
                .eq('id', session?.user.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setProfile(data)
            }
        } catch (error) {
            if (error instanceof Error) {
                // console.log(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    async function signOut() {
        await supabase.auth.signOut()
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Área do Cliente</Text>

                <View style={styles.card}>
                    <Text style={styles.label}>Logado como:</Text>
                    <Text style={styles.email}>{session.user.email}</Text>

                    {loading ? (
                        <ActivityIndicator style={{ marginTop: 10 }} color="#4F46E5" />
                    ) : (
                        profile?.full_name && (
                            <Text style={styles.name}>{profile.full_name}</Text>
                        )
                    )}
                </View>

                <TouchableOpacity style={styles.button} onPress={signOut}>
                    <Text style={styles.buttonText}>Sair</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827',
        padding: 24,
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        gap: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
    },
    card: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
    },
    label: {
        color: '#9CA3AF',
        fontSize: 14,
        marginBottom: 4,
    },
    email: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },
    name: {
        color: '#E5E7EB',
        fontSize: 16,
        marginTop: 8,
    },
    button: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 100,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
})
