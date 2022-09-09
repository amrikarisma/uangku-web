import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Link from 'next/link'
import Label from '@/components/Label'
import { DateRangePicker } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'
import Pagination from 'react-js-pagination'
import {
    startOfDay,
    endOfDay,
    startOfMonth,
    lastDayOfMonth,
    subMonths,
    addMonths,
    subDays,
} from 'date-fns'

const Transaction = () => {
    const Ranges = [
        {
            label: '7 Hari Terakhir',
            value: [startOfDay(subDays(new Date(), 6)), endOfDay(new Date())],
        },
        {
            label: '30 Hari Terakhir',
            value: [startOfDay(subDays(new Date(), 30)), endOfDay(new Date())],
        },
        {
            label: 'Bulan Lalu',
            value: [
                startOfMonth(subMonths(new Date(), 1)),
                lastDayOfMonth(subMonths(new Date(), 1)),
            ],
        },
        {
            label: 'Bulan Ini',
            value: [startOfMonth(new Date()), lastDayOfMonth(new Date())],
        },
        {
            label: 'Bulan Depan',
            value: [
                startOfMonth(addMonths(new Date(), 1)),
                lastDayOfMonth(addMonths(new Date(), 1)),
            ],
        },
    ]

    const startDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 1,
        1,
    )
    const endDate = new Date()
    const [transactions, setTransactions] = useState([])
    const [dateRange, setDateRange] = useState([startDate, endDate])

    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = async (pageNumber = 1, date = null) => {
        date = date ? date : dateRange
        let filterStartDate = `${date[0].getFullYear()}-${
            date[0].getMonth() + 1
        }-${date[0].getDate()}`
        let filterEndDate = date[1]
            ? `${date[1].getFullYear()}-${
                  date[1].getMonth() + 1
              }-${date[1].getDate()}`
            : `${date[0].getFullYear()}-${
                  date[0].getMonth() + 1
              }-${date[0].getDate()}`
        await axios
            .get(
                `/api/transaction?page=${pageNumber}&startDate=${filterStartDate}&endDate=${filterEndDate}`,
            )
            .then(res => {
                setTransactions(res.data.data)
            })
            .catch(error => {
                if (error.response.status !== 409) throw error
            })
    }
    const deleteItem = id => {
        if (confirm('Do you want to delete this?')) {
            axios
                .delete(`/api/transaction/destroy/${id}`)
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

    const getViewDate = (input, view) => {
        let output
        const date = new Date(`${input}`)
        const month = date.toLocaleString('default', { month: 'long' })
        if (view == 'day') {
            output = `${date.getDate()}`
        } else if (view == 'month') {
            output = `${month}`
        } else if (view == 'year') {
            output = `${date.getFullYear()}`
        } else {
            output = `${date.getDate()} ${month} ${date.getFullYear()}`
        }
        return output
    }

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Transaction
                </h2>
            }>
            <Head>
                <title>Transaction - Uangku</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-2 py-6 md:px-6 py-6 bg-white border-b border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <div>
                                    <div className="flex justify-between">
                                        <span>Pemasukan</span>
                                        <span className="text-green-600 whitespace-nowrap">
                                            {formatCurrency(
                                                transactions.income,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Pengeluaran</span>
                                        <span className="text-red-600 whitespace-nowrap">
                                            {formatCurrency(
                                                transactions.spending,
                                            )}
                                        </span>
                                    </div>
                                    <hr className="my-3" />
                                    <div className="flex justify-between">
                                        <span>Saldo Saat ini</span>
                                        <span
                                            className={`${
                                                transactions.total < 0
                                                    ? 'text-red-600'
                                                    : 'text-green-600'
                                            } font-bold mt-2`}>
                                            {formatCurrency(transactions.total)}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="date">Date</Label>
                                    <DateRangePicker
                                        block
                                        size="lg"
                                        showOneCalendar
                                        onChange={event => {
                                            setDateRange(event)
                                            fetchData(1, event)
                                        }}
                                        defaultValue={dateRange}
                                        value={dateRange}
                                        ranges={Ranges}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="my-8">
                        <Link href="/transaction/create">
                            <a className="m-4 p-2 bg-blue-500 rounded text-white">
                                Create
                            </a>
                        </Link>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="py-6">
                            <table className="border-collapse table-auto w-full text-sm">
                                <tbody>
                                    {transactions?.transactions?.data?.map(
                                        transaction => (
                                            <tr
                                                className="px-2 py-6 md:px-6 bg-white border-b border-gray-200"
                                                transaction="{transaction}"
                                                key={transaction.id}>
                                                <td className="p-2 md:p-4 md:pl-8 text-slate-500 dark:text-slate-400 md:w-1/5">
                                                    <div className="md:inline text-center font-bold md:pr-4 text-2xl md:text-xl">
                                                        {getViewDate(
                                                            transaction.date,
                                                            'day',
                                                        )}
                                                    </div>
                                                    <div className="md:inline  text-center font-bold md:text-xl">
                                                        {getViewDate(
                                                            transaction.date,
                                                            'month',
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-2 md:p-4 pl-4 md:pl-8 text-slate-500 dark:text-slate-400 md:w-1/3">
                                                    <div className="font-bold">
                                                        {
                                                            transaction
                                                                .transaction_category
                                                                .title
                                                        }
                                                    </div>
                                                    <div className="italic">
                                                        {
                                                            transaction.description
                                                        }
                                                    </div>
                                                    <div
                                                        className={`${
                                                            transaction
                                                                .transaction_category
                                                                .type ==
                                                            'spending'
                                                                ? 'text-red-600'
                                                                : 'text-green-600'
                                                        } font-bold mt-2`}>
                                                        {
                                                            transaction
                                                                .transaction_category
                                                                .type
                                                        }
                                                    </div>
                                                    <div className="mt-2 sm:mb-10 md:mb-0 ">
                                                        <Link
                                                            href={`/transaction/edit/${transaction.id}`}>
                                                            <a className="mr-4 text-slate-600">
                                                                Edit
                                                            </a>
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            className={`text-red-600`}
                                                            onClick={() =>
                                                                deleteItem(
                                                                    transaction.id,
                                                                )
                                                            }>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                                <td
                                                    className={`${
                                                        transaction.amount > 0
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    } p-4 md:pl-8 text-right font-bold md:w-1/3`}>
                                                    {formatCurrency(
                                                        transaction.amount,
                                                    )}
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                            <div className="mt-10">
                                <Pagination
                                    activePage={
                                        transactions?.transactions?.current_page
                                            ? transactions?.transactions
                                                  ?.current_page
                                            : 0
                                    }
                                    itemsCountPerPage={
                                        transactions?.transactions?.per_page
                                            ? transactions?.transactions
                                                  ?.per_page
                                            : 0
                                    }
                                    totalItemsCount={
                                        transactions?.transactions?.total
                                            ? transactions?.transactions?.total
                                            : 0
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

export default Transaction
