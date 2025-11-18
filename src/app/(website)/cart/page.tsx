import HeadingText from '@/components/ReusableSection/HeadingText'
import Newsletter from '@/components/ReusableSection/Newsletter'
import OurProducts from '@/components/ReusableSection/OurProducts'
import CartProducts from '@/components/website/PageSections/CartPage/CartProducts'
import React from 'react'

const page = () => {
  return (
    <div>
      <HeadingText
        subHeading="Cart"
        heading="Your Shopping Cart"
        description="Review your selected products and services before proceeding to checkout."
        align="center"
      />
      <CartProducts />
      <OurProducts />
      <Newsletter />
    </div>
  )
}

export default page