/* eslint-disable no-unused-vars */
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Input from '@/components/Input'
import Label from '@/components/Label'
import Button from '@/components/Button'
import { useRouter } from 'next/router'
import { DatePicker } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'
import { Notify } from 'notiflix'
import formatCurrency from '@/lib/helper'

const EditTransaction = ({ id }) => {
    const [amount, setAmount] = useState(0)
    const [amountFormated, setAmountFormated] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState('')
    const [types] = useState(['income', 'spending'])
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState('')
    const [wallets, setWallets] = useState([])
    const [wallet, setWallet] = useState('')
    const [date, setDate] = useState(new Date())
    const [deptList, setDeptList] = useState([])
    const [dept, setDept] = useState('')
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    const router = useRouter()

    useEffect(() => {
        fetchData()
    }, [])
    const getWallets = async value => {
        await axios
            .get(`/api/wallet?showAll=1`)
            .then(res => {
                setWallets(res.data.data)
            })
            .catch(error => {
                setErrors(error)
                if (error.response.status !== 409) throw error
            })
    }

    const getDeptList = async value => {
        await axios
            .get(`/api/transaction/dept/${value}`)
            .then(res => {
                // eslint-disable-next-line no-console
                setDeptList(res.data.data)
            })
            .catch(error => {
                setErrors(error)
                if (error.response.status !== 409) throw error
            })
    }

    const fetchData = async () => {
        await axios
            .get(`/api/transaction/${id}`)
            .then(res => {
                getWallets()
                setWallet(res.data.data.wallet_id)
                getCategories(res.data.data.t_category.type)
                setAmount(
                    res.data.data.amount < 0
                        ? res.data.data.amount * -1
                        : res.data.data.amount,
                )
                let valueFormated = formatCurrency(
                    res.data.data.amount < 0
                        ? res.data.data.amount * -1
                        : res.data.data.amount,
                )
                setAmountFormated(valueFormated)

                setDescription(res.data.data.description ?? '')
                setType(res.data.data.t_category.type)
                setCategory(res.data.data.category_id)
                setDate(new Date(`${res.data.data.date}`))
                getDeptList(res.data.data.category_id)
                setDept(res.data.data?.t_detail?.tr_id)
            })
            .catch(error => {
                if (error.response.status !== 409) throw error
            })
    }
    const getCategories = async value => {
        await axios
            .get(`/api/transaction/category?showAll=1&type=${value}`)
            .then(res => {
                setCategories(res.data.data)
            })
            .catch(error => {
                if (error.response.status !== 409) throw error
            })
    }

    const currencyInput = value => {
        let tempValue = value
            .replace(/[Rp]/gi, '')
            .toString()
            .replaceAll(' ', '')
            .replaceAll('.', '')

        setAmount(tempValue)
        let valueFormated = formatCurrency(tempValue)
        setAmountFormated(valueFormated)
    }

    const submitForm = async event => {
        event.preventDefault()
        const fetchData = async () => {
            await axios
                .put(`/api/transaction/update/${id}`, {
                    wallet,
                    amount,
                    description,
                    category,
                    dept,
                    date,
                    type,
                })
                .then(res => {
                    setStatus(res.data.status)
                    router.push('/transaction')
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
        fetchData()
    }

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Transaction
                </h2>
            }>
            <Head>
                <title>Transaction - Uangku </title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-2 py-6 md:px-6 py-6 bg-white border-b border-gray-200">
                            <form onSubmit={submitForm}>
                                <div className="mt-4">
                                    <Label htmlFor="wallet">My Wallet</Label>
                                    <select
                                        name="wallet"
                                        className="mt-1 block w-full"
                                        onChange={event =>
                                            setWallet(event.target.value)
                                        }
                                        value={wallet}
                                        required>
                                        <option value={``}>
                                            Select Wallet
                                        </option>

                                        {wallets?.map(item => (
                                            <option
                                                key={item.id}
                                                value={`${item.id}`}>
                                                {`${
                                                    item.name
                                                } (${formatCurrency(
                                                    item.start_balance,
                                                )})`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-4">
                                    <Label htmlFor="type">Type</Label>
                                    <select
                                        className="mt-1 block w-full"
                                        onChange={event => {
                                            setType(event.target.value)
                                            getCategories(event.target.value)
                                        }}
                                        value={type}
                                        required>
                                        <option value={``}>Select Type</option>

                                        {types.map(item => (
                                            <option key={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-4">
                                    <Label htmlFor="category">Category</Label>
                                    <select
                                        className="mt-1 block w-full"
                                        onChange={event => {
                                            setCategory(event.target.value)
                                            getDeptList(event.target.value)
                                        }}
                                        value={category}
                                        required>
                                        <option value={``}>
                                            Select Category
                                        </option>

                                        {categories?.map(item => (
                                            <option
                                                key={item.id}
                                                value={`${item.id}`}>
                                                {item.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {deptList.length > 0 && (
                                    <div className="mt-4">
                                        <Label htmlFor="dept">Hutang</Label>
                                        <select
                                            className="mt-1 block w-full"
                                            onChange={event => {
                                                setDept(event.target.value)
                                            }}
                                            value={dept}
                                            required>
                                            <option value={``}>
                                                Pilih Hutang
                                            </option>

                                            {deptList?.map(item => (
                                                <option
                                                    key={item.id}
                                                    value={item.id}>
                                                    {`${
                                                        item.description
                                                    } ${formatCurrency(
                                                        item.amount,
                                                    )}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div className="mt-4">
                                    <Label htmlFor="amount">Amount</Label>
                                    <Input
                                        name="amount"
                                        type="text"
                                        onChange={event => {
                                            currencyInput(event.target.value)
                                        }}
                                        value={`${amountFormated}`}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Input
                                        name="description"
                                        type="text"
                                        onChange={event => {
                                            setDescription(event.target.value)
                                        }}
                                        value={`${description}`}
                                        className="mt-1 block w-full"
                                    />
                                </div>
                                <div className="mt-4">
                                    <Label htmlFor="description">Date</Label>
                                    <DatePicker
                                        format="yyyy-MM-dd HH:mm:ss"
                                        block
                                        size="lg"
                                        placeholder="Select Date Range"
                                        onChange={event => {
                                            setDate(event)
                                        }}
                                        defaultValue={date}
                                        value={date}
                                    />
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <Button className="ml-4">Submit</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default EditTransaction

export async function getServerSideProps({ params }) {
    return {
        props: { id: params.id },
    }
}
