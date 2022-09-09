import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'

export default function Home() {
    const { user } = useAuth({ middleware: 'guest' })

    return (
        <>
            <Head>
                <title>Uangku - Made with ♥</title>
            </Head>

            <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
                <div className="hidden fixed top-0 right-0 px-6 py-4 sm:block">
                    {user ? (
                        <Link href="/dashboard">
                            <a className="ml-4 text-sm text-gray-700 underline">
                                Dashboard
                            </a>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login">
                                <a className="text-sm text-gray-700 underline">
                                    Login
                                </a>
                            </Link>

                            <Link href="/register">
                                <a className="ml-4 text-sm text-gray-700 underline">
                                    Register
                                </a>
                            </Link>
                        </>
                    )}
                </div>

                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="mt-8 p-10 bg-white dark:bg-gray-800 overflow-hidden shadow sm:rounded-lg">
                        <h1 className="font-bold dark:text-white">
                            {`Money Manager atau Aplikasi Pencatat Keuangan Masuk & Keluar.`}
                        </h1>
                        <div className="block">
                            {user ? (
                                <Link href="/dashboard">
                                    <a className="ml-4 dark:text-white text-sm text-gray-700 underline">
                                        Dashboard
                                    </a>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <a className="text-sm dark:text-white text-gray-700 underline">
                                            Login
                                        </a>
                                    </Link>

                                    <Link href="/register">
                                        <a className="ml-4 text-sm dark:text-white text-gray-700 underline">
                                            Register
                                        </a>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
