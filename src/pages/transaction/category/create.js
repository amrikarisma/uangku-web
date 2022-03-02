import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useState } from 'react'
import axios from '@/lib/axios'
import Input from '@/components/Input'
import Label from '@/components/Label'
import Button from '@/components/Button'
import { useRouter } from 'next/router'

const Category = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState('')
    const [types] = useState(['income', 'spending'])
    const [setErrors] = useState([])
    const [setStatus] = useState(null)
    const router = useRouter()

    const submitForm = async event => {
        event.preventDefault()
        const fetchData = async () => {
            await axios
                .post('/api/transaction/category/store', {
                    title,
                    description,
                    type,
                })
                .then(res => {
                    setStatus(res.data.status)
                    router.push('/transaction/category')
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
                    Category
                </h2>
            }>
            <Head>
                <title>Category - Uangku</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-2 py-6 md:px-6 py-6 bg-white border-b border-gray-200">
                            <form onSubmit={submitForm}>
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        name="title"
                                        type="text"
                                        onChange={event =>
                                            setTitle(event.target.value)
                                        }
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
                                        onChange={event =>
                                            setDescription(event.target.value)
                                        }
                                        className="mt-1 block w-full"
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <Label htmlFor="type">Type</Label>
                                    <select
                                        className="mt-1 block w-full"
                                        onChange={event =>
                                            setType(event.target.value)
                                        }
                                        value={type}
                                        required>
                                        <option value={``} disabled>
                                            Select Type
                                        </option>

                                        {types.map(item => (
                                            <option key={item}>{item}</option>
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

export default Category
