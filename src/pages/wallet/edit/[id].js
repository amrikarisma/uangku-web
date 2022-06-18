/* eslint-disable no-unused-vars */
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Input from '@/components/Input'
import Label from '@/components/Label'
import Button from '@/components/Button'
import { useRouter } from 'next/router'

const EditWallet = ({ id }) => {
    const [name, setName] = useState('')
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState('')
    const [start_balance, setStartBalance] = useState(0)
    const [start_balance_formated, setStartBalanceFormated] = useState(0)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)
    const router = useRouter()

    useEffect(() => {
        getCategory()
        fetchData()
    }, [])

    const fetchData = async () => {
        await axios
            .get(`/api/wallet/${id}`)
            .then(res => {
                setName(res.data.data.name)
                setCategory(res.data.data.category_id)
                currencyInput(res.data.data.start_balance)
            })
            .catch(error => {
                if (error.response.status !== 409) throw error
            })
    }

    const submitForm = async event => {
        event.preventDefault()
        const fetchData = async () => {
            await axios
                .put(`/api/wallet/update/${id}`, {
                    name,
                    category,
                    start_balance,
                })
                .then(res => {
                    setStatus(res.data.status)
                    router.push('/wallet')
                })
                .catch(error => {
                    setErrors(error)
                    if (error.response.status !== 409) throw error
                })
        }
        fetchData()
    }

    const currencyInput = value => {
        let tempValue = value
            .replace(/[Rp]/gi, '')
            .toString()
            .replaceAll(' ', '')
            .replaceAll('.', '')

        setStartBalance(tempValue)
        formatCurrency(tempValue)
    }

    const formatCurrency = tempValue => {
        let formatCurrency = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(tempValue)
        setStartBalanceFormated(formatCurrency)
    }

    const getCategory = async value => {
        await axios
            .get(`/api/wallet/category`)
            .then(res => {
                setCategories(res.data.data)
            })
            .catch(error => {
                setErrors(error)
                if (error.response.status !== 409) throw error
            })
    }

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Wallet
                </h2>
            }>
            <Head>
                <title>Edit Wallet - Uangku</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-2 py-6 md:px-6 py-6 bg-white border-b border-gray-200">
                            <form onSubmit={submitForm}>
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        name="name"
                                        type="text"
                                        onChange={event =>
                                            setName(event.target.value)
                                        }
                                        value={`${name}`}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <Label htmlFor="start_balance">
                                        Starting Balance
                                    </Label>
                                    <Input
                                        name="start_balance"
                                        type="text"
                                        onChange={event => {
                                            currencyInput(event.target.value)
                                        }}
                                        value={`${start_balance_formated}`}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <Label htmlFor="category">Category</Label>
                                    <select
                                        className="mt-1 block w-full"
                                        onChange={event =>
                                            setCategory(event.target.value)
                                        }
                                        value={category}
                                        required>
                                        <option value={``} disabled>
                                            Select Category
                                        </option>

                                        {categories.map(item => (
                                            <option
                                                key={item.id}
                                                value={`${item.id}`}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
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

export default EditWallet

export async function getServerSideProps({ params }) {
    return {
        props: { id: params.id },
    }
}
