import Button from '@/components/Button'
import Label from '@/components/Label'
import AppLayout from '@/components/Layouts/AppLayout'
import axios from '@/lib/axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Input } from 'rsuite'

const Setting = () => {
    const [categories, setCategories] = useState([])
    const [dept_category, setDeptCategory] = useState('')
    const [receivable_category, setReceivableCategory] = useState('')
    const [setting, setSetting] = useState([])
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)
    const router = useRouter()

    useEffect(() => {
        getCategory()
        getSetting()
    }, [])

    const getCategory = async value => {
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
                    if (item.key == 'receivable_category') {
                        setReceivableCategory(item.value)
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
                key: 'receivable_category',
                value: receivable_category,
            },
        ])
        const fetchData = async (key, value) => {
            await axios
                .post('/api/setting/transaction/store', {
                    key,
                    value,
                })
                .then(res => {
                    setStatus(res.data.status)
                })
                .catch(error => {
                    setErrors(error)
                    if (error.response.status !== 409) throw error
                })
        }
        setting.map(item => {
            fetchData(item.key, item.value)
        })
        // router.push('/transaction')
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
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-2 py-6 md:px-6 py-6 bg-white border-b border-gray-200">
                            <form onSubmit={submitForm}>
                                <div className="mt-4">
                                    <Label htmlFor="category">
                                        Dept Category
                                    </Label>
                                    <select
                                        name="category"
                                        className="mt-1 block w-full"
                                        onChange={event =>
                                            setDeptCategory(event.target.value)
                                        }
                                        value={dept_category}
                                        required>
                                        <option value={``} disabled>
                                            Select Dept Category
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
                                <div className="mt-4">
                                    <Label htmlFor="receivable_category">
                                        Receivable Category
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
                                        <option value={``} disabled>
                                            Select Reveivable Category
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

export default Setting
