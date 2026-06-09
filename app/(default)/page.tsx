import { Suspense } from 'react'
import Masonry from '~/components/Masonry'
import { fetchClientImagesListByAlbum, fetchClientImagesPageTotalByAlbum } from '~/server/db/query'
import { ImageHandleProps } from '~/types'

export default async function Home() {
  const getData = async (pageNum: number, album: string) => {
    'use server'
    return await fetchClientImagesListByAlbum(pageNum, album)
  }

  const getPageTotal = async (album: string) => {
    'use server'
    return await fetchClientImagesPageTotalByAlbum(album)
  }

  const props: ImageHandleProps = {
    handle: getData,
    args: 'getImages-client',
    album: '/',
    totalHandle: getPageTotal
  }

  return (
    <Suspense fallback={<div className="w-full h-32 flex items-center justify-center">加载中...</div>}>
      <Masonry {...props} />
    </Suspense>
  )
}
