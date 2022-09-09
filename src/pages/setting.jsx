/* eslint-disable no-unused-vars */
import Button from '@/components/Button'
import Label from '@/components/Label'
import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Notify } from 'notiflix/build/notiflix-notify-aio'

const Setting = () => {
    const [categories, setCategories] = useState([])
    const [dept_category, setDeptCategory] = useState('')
    const [payback_dept_category, setPaybackDeptCategory] = useState('')
    const [receivable_category, setReceivableCategory] = useState('')
    const [
        payback_receivable_category,
        setPaybackReceivableCategory,
    ] = useState('')
    const [setting, setSetting] = useState([])
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    useEffect(() => {
        getCategory()
        getSetting()
    }, [])

    const getCategory = async () => {
        await axios
            .get(`/api/transaction/category?showAll=1`)
            .then(res => {
                setCategories(res.data.data)
                setStatus(res.data.status)
            })
            .catch(error => {
                setErrors(error)
                if (error.response.status !== 409) throw error
            })
    }
    const getSetting = async () => {
        await axios
            .get(`/api/setting/transaction`)
            .then(res => {
                res.data.data.map(item => {
                    if (item.key == 'dept_category') {
                        setDeptCategory(item.value)
                    }
                    if (item.key == 'payback_dept_category') {
                        setPaybackDeptCategory(item.value)
                    }
                    if (item.key == 'receivable_category') {
                        setReceivableCategory(item.value)
                    }
                    if (item.key == 'payback_receivable_category') {
                        setPaybackReceivableCategory(item.value)
                    }
                })
            })
            .catch(error => {
                setErrors(error)
                if (error.response.status !== 409) throw error
            })
    }

    const submitForm = async event => {
        event.preventDefault()
        setSetting([
            {
                key: 'dept_category',
                value: dept_category,
            },
            {
                key: 'payback_dept_category',
                value: payback_dept_category,
            },
            {
                key: 'receivable_category',
                value: receivable_category,
            },
            {
                key: 'payback_receivable_category',
                value: payback_receivable_category,
            },
        ])
        const fetchData = async settings => {
            await axios
                .post('/api/setting/transaction/store', {
                    settings: settings,
                })
                .then(res => {
                    if (res.data.status) {
                        Notify.success('Berhasil disimpan!')
                    } else {
                        Notify.failure('Gagal disimpan!')
                    }
                })
                .catch(error => {
                    setErrors(error)
                    if (error.response.status !== 409) throw error
                })
        }

        fetchData(setting)
    }
    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Setting
                </h2>
            }>
            <Head>
                <title>Setting - Uangku</title>
            </Head>
            <div className="py-12">
                <form onSubmit={submitForm}>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-4">
                            <div className="px-2 py-6 md:px-6 py-6 bg-white border-b border-gray-200">
                                <div className="py-4">
                                    <Label htmlFor="dept_category">
                                        Kategori Hutang
                                    </Label>
                                    <select
                                        name="dept_category"
                                        className="mt-1 block w-full"
                                        onChange={event =>
                                            setDeptCategory(event.target.value)
                                        }
                                        value={dept_category}
                                        required>
                                        <option value={``}>
                                            Pilih Kategori Hutang
                                        </option>

                                        {categories?.map(item => {
                                            if (item.type == 'income') {
                                                return (
                                                    <option
                                                        key={item.id}
                                                        value={`${item.id}`}>
                                                        {item.title}
                                                    </option>
                                                )
                                            }
                                        })}
                                    </select>
                                </div>
                                <div className="py-4">
                                    <Label htmlFor="payback_dept_category">
                                        Kategori Pembayaran Hutang
                                    </Label>
                                    <select
                                        name="payback_dept_category"
                                        className="mt-1 block w-full"
                                        onChange={event =>
                                            setPaybackDeptCategory(
                                                event.target.value,
                                            )
                                        }
                                        value={payback_dept_category}
                                        required>
                                        <option value={``}>
                                            Pilih Kategori Pembayaran Hutang
                                        </option>

                                        {categories?.map(item => {
                                            if (item.type == 'spending') {
                                                return (
                                                    <option
                                                        key={item.id}
                                                        value={`${item.id}`}>
                                                        {item.title}
                                                    </option>
                                                )
                                            }
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="px-2 py-6 md:px-6 py-6 bg-white border-b border-gray-200">
                                <div className="py-4">
                                    <Label htmlFor="receivable_category">
                                        Kategori Piutang
                                    </Label>
                                    <select
                                        name="receivable_category"
                                        className="mt-1 block w-full"
                                        onChange={event =>
                                            setReceivableCategory(
                                                event.target.value,
                                            )
                                        }
                                        value={receivable_category}
                                        required>
                                        <option value={``}>
                                            Pilih Kategori Piutang
                                        </option>

                                        {categories?.map(item => {
                                            if (item.type == 'spending') {
                                                return (
                                                    <option
                                                        key={item.id}
                                                        value={`${item.id}`}>
                                                        {item.title}
                                                    </option>
                                                )
                                            }
                                        })}
                                    </select>
                                </div>
                                <div className="py-4">
                                    <Label htmlFor="receivable_category">
                                        Kategori Pembayaran Piutang
                                    </Label>
                                    <select
                                        name="payback_receivable_category"
                                        className="mt-1 block w-full"
                                        onChange={event =>
                                            setPaybackReceivableCategory(
                                                event.target.value,
                                            )
                                        }
                                        value={payback_receivable_category}
                                        required>
                                        <option value={``}>
                                            Pilih Kategori Pembayaran Piutang
                                        </option>

                                        {categories?.map(item => {
                                            if (item.type == 'income') {
                                                return (
                                                    <option
                                                        key={item.id}
                                                        value={`${item.id}`}>
                                                        {item.title}
                                                    </option>
                                                )
                                            }
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end mt-4">
                            <Button className="ml-4">Submit</Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    )
}

export default Setting
