import useStore from '@/helpers/store'
import dynamic from 'next/dynamic'
import Layout from '@/components/layout/'
import HDRIInfo from '../../components/HDRIInfo'
import { useEffect } from 'react'
import { API_ENDPOINT } from '@/helpers/constants/api'
import NextAndPrev from '@/components/NextAndPrev'
import Error from '../404'

const Viewer = dynamic(() => import('@/components/canvas/HDRI'), {
  ssr: false,
})

const Page = ({ title, hdri, notFound }) => {
  useEffect(() => {
    useStore.setState({ title })
  }, [title])
  if (notFound) return <Error />
  return (
    <Layout title={title}>
      <main className='block my-10 sm:grid sm:grid-cols-3 gap-x-4 gap-y-8'>
        <div className='min-w-full min-h-full col-span-2'>
          <Viewer {...hdri} />
        </div>
        <HDRIInfo {...hdri} />
      </main>
      <NextAndPrev {...hdri} />
    </Layout>
  )
}

export default Page

export async function getServerSideProps({ params }) {
  try {
    const data = await fetch(`${API_ENDPOINT}/hdris/${params.name}`)
    const hdri = await data.json()
    return {
      props: {
        hdri,
        title: hdri.name,
      },
    }
  } catch {
    return {
      props: {
        notFound: true,
      },
    }
  }
}
