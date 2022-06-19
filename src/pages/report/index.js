import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import ArrowRightLineIcon from '@rsuite/icons/ArrowRightLine'
const Reports = () => {
    const [report, setReport] = useState([])

    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = async (pageNumber = 1) => {
        await axios
            .get(`/api/report?page=${pageNumber}`)
            .then(res => setReport(res.data.data))
            .catch(error => {
                if (error.response.status !== 409) throw error
            })
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
                    Reports
                    <p className="text-sm font-light italic">
                        Bulan ini ({report.range_date})
                    </p>
                </h2>
            }>
            <Head>
                <title>Reports - Uangku</title>
            </Head>

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-2 py-6 md:px-6 py-6 bg-white border-b border-gray-200 flex">
                            <div className="w-1/2 flex justify-center">
                                <div>
                                    <div>Saldo Awal</div>
                                    <div className="amount-balance">
                                        <strong>
                                            {formatCurrency(
                                                report.start_balance,
                                            )}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2 flex justify-center">
                                <div>
                                    <div>Saldo Akhir</div>
                                    <div className="amount-balance">
                                        <strong>
                                            {formatCurrency(
                                                report.current_balance,
                                            )}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-2 py-6 md:px-6 py-6 bg-white border-b border-gray-200 flex">
                            <div className="max-w-7xl mx-auto w-1/2 flex justify-center">
                                <div>
                                    <div>Pemasukan Bersih</div>
                                    <div className="amount-balance">
                                        <strong className="text-xl">
                                            {formatCurrency(report.nett_income)}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-2 py-6 md:px-6 py-6 bg-white border-b border-gray-200 flex">
                            <div className="w-1/2 flex justify-center">
                                <div>
                                    <div>Pemasukan</div>
                                    <div className="amount-balance">
                                        <strong className="text-green-600 ">
                                            {formatCurrency(report.income)}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2 flex justify-center">
                                <div>
                                    <div>Pengeluaran</div>
                                    <div className="amount-balance">
                                        <strong className="text-red-600 ">
                                            {formatCurrency(report.spending)}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-2 md:px-20 py-2 bg-white hover:bg-green-50 hover:cursor-pointer border-b border-gray-200 flex">
                            <div className="w-1/3">
                                <div>Hutang</div>
                            </div>
                            <div className="w-2/3 flex justify-end">
                                <div className="">
                                    <div className="amount-balance flex justify-end">
                                        <div className="text-green-600 ">
                                            {formatCurrency(report.dept)}
                                        </div>
                                    </div>
                                    <div className="amount-balance flex justify-end">
                                        <div className="text-sm text-gray-400 ">
                                            {formatCurrency(
                                                report.dept_remaining,
                                            ) + ' tersisa'}
                                        </div>
                                    </div>
                                </div>
                                <div className="pl-4 self-center">
                                    <ArrowRightLineIcon />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-2 md:px-20 py-2 bg-white hover:bg-green-50 hover:cursor-pointer border-b border-gray-200 flex">
                            <div className="w-1/3">
                                <div>Piutang</div>
                            </div>
                            <div className="w-2/3 flex justify-end">
                                <div className="">
                                    <div className="amount-balance flex justify-end">
                                        <div className="text-red-600 ">
                                            {formatCurrency(report.receivable)}
                                        </div>
                                    </div>
                                    <div className="amount-balance flex justify-end">
                                        <div className="text-sm text-gray-400 ">
                                            {formatCurrency(
                                                report.receivable_remaining,
                                            ) + ' tersisa'}
                                        </div>
                                    </div>
                                </div>
                                <div className="pl-4 self-center">
                                    <ArrowRightLineIcon />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-2 md:px-20 py-2 bg-white hover:bg-green-50 hover:cursor-pointer border-b border-gray-200 flex">
                            <div className="w-1/3">
                                <div>Lainnya</div>
                            </div>
                            <div className="w-2/3 flex justify-end">
                                <div className="amount-balance">
                                    <div className="">
                                        {formatCurrency(report.other)}
                                    </div>
                                </div>
                                <div className="pl-4 self-center">
                                    <ArrowRightLineIcon />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default Reports
