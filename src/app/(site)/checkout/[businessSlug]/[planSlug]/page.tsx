import { prisma } from "@/libs/prismaDb";
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    business: string
    plan: string
  }
}

export default async function CheckoutPage({ params }: PageProps) {
  const { business, plan } = params
  
  try {
    // Fetch data directly in the component
    const businessData = await prisma.business.findFirst({
      where: { slug: business },
      include: {
        plans: {
          where: { slug: plan }
        }
      }
    })

    if (!businessData || !businessData.plans.length) {
      notFound()
    }

    return (
      <div>
        <h1>{businessData.name}</h1>
        <h2>{businessData.plans[0].name} - ${businessData.plans[0].price}</h2>
      </div>
    )
  } catch (error) {
    console.error('Error fetching checkout data:', error)
    notFound()
  }
}