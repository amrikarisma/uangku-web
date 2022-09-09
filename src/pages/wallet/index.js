import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Button from '@/components/Button'
import Link from 'next/link'
import Pagination from 'react-js-pagination'

const Wallets = () => {
    const [wallets, setWallets] = useState([])

    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = async (pageNumber = 1) => {
        await axios
            .get(`/api/wallet?page=${pageNumber}`)
            .then(res => setWallets(res.data.data))
            .catch(error => {
                if (error.response.status !== 409) throw error
            })
    }
    const deleteItem = id => {
        if (confirm('Do you want to delete this?')) {
            axios
                .delete(`/api/wallet/destroy/${id}`)
                .then(() => {
                    fetchData()
                })
                .catch(error => {
                    if (error.response.status !== 409) throw error
                })
        }
    }

    const formatCurrency = tempValue => {
        let formatCurrency = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(tempValue)
        return formatCurrency
    }

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    My Wallets
                </h2>
            }>
            <Head>
                <title>My Wallets - Uangku</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-2 py-6 md:px-6 py-6 bg-white border-b border-gray-200">
                            <Link href="/wallet/create">
                                <a className="m-4 p-2 bg-blue-500 rounded text-white">
                                    Create
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-2 py-6 md:px-6 py-6 bg-white border-b border-gray-200">
                            <table className="border-collapse table-auto w-full text-sm">
                                <thead>
                                    <tr>
                                        <td className="border-b dark:border-slate-600 font-medium p-4 md:pl-8 pt-0 pb-3 text-slate-400 text-left">
                                            Name
                                        </td>
                                        <td className="border-b dark:border-slate-600 font-medium p-4 md:pl-8 pt-0 pb-3 text-slate-400 text-left">
                                            Starting Balance
                                        </td>
                                        <td className="border-b dark:border-slate-600 font-medium p-4 md:pl-8 pt-0 pb-3 text-slate-400 text-left">
                                            Action
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {wallets?.data?.map(wallet => (
                                        <tr wallet="{wallet}" key={wallet.id}>
                                            <td className="p-4 md:pl-8 text-slate-500 dark:text-slate-400">
                                                {wallet.name}
                                            </td>
                                            <td className="p-4 md:pl-8 text-slate-500 dark:text-slate-400">
                                                {formatCurrency(
                                                    wallet.start_balance,
                                                )}
                                            </td>
                                            <td className="p-1 md:pl-8 text-slate-500 dark:text-slate-400">
                                                <Link
                                                    href={`/wallet/edit/${wallet.id}`}>
                                                    <a className="m-1 bg-slate-500 rounded text-white text-xs inline-flex items-center px-2 py-1 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="currentColor"
                                                            className="bi bi-pencil-square"
                                                            viewBox="0 0 16 16">
                                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                                                            />
                                                        </svg>
                                                    </a>
                                                </Link>
                                                <Button
                                                    type="button"
                                                    className={`m-1 px-2 py-1 bg-red-600 text-xs`}
                                                    onClick={() =>
                                                        deleteItem(wallet.id)
                                                    }>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        className="bi bi-trash"
                                                        viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                                        />
                                                    </svg>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-10">
                                <Pagination
                                    activePage={
                                        wallets?.current_page
                                            ? wallets?.current_page
                                            : 0
                                    }
                                    itemsCountPerPage={
                                        wallets?.per_page
                                            ? wallets?.per_page
                                            : 0
                                    }
                                    totalItemsCount={
                                        wallets?.total ? wallets?.total : 0
                                    }
                                    onChange={pageNumber => {
                                        fetchData(pageNumber)
                                    }}
                                    pageRangeDisplayed={8}
                                    itemClass="inline"
                                    linkClass="inline px-3 py-2 mx-1 bg-slate-500 text-white hover:text-white visited:text-white rounded"
                                    firstPageText="First Page"
                                    lastPageText="Last Lage"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default Wallets
