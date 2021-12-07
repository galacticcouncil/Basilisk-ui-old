import React from 'react'
import { useLoading } from '../hooks/misc/useLoading'
import { TopBar } from './TopBar'

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
    const loading = useLoading();
    return (
        <div style={{
            padding: '24px',
            width: '650px',
            margin: '0 auto'
        }}>
            <TopBar />
            {loading
                ? <div style={{
                    width: '100%',
                    textAlign: 'center',
                }}>
                    <i>Connecting to the node...</i>
                </div>
                : children
            }
        </div>
    )
}