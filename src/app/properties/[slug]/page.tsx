import AllinOne from '@/dynamicComponents/AllinOne'

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    return <div>
        <AllinOne id={slug}/>
    </div>
  }