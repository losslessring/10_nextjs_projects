import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { groq } from 'next-sanity'
import Image from 'next/image'
import Link from 'next/link'

async function getProducts() {
    return client.fetch(
        groq`*[_type == "product"] {
        title,
        "slug": slug.current,
        mainImage {
          asset -> {
            url
          },
          alt,
        },
        publishedAt,
        price,
        rating,
        categories[] -> {
          "categoryTitle": title
        },
        "authorName": author -> name
      } | order(publishedAt desc)`
    )
}

export default async function Products() {
    const products = await getProducts()

    return (
        <div className="container mx-auto px-4 py-20">
            <h1 className="mb-8 text-3xl font-bold">
                Viewing available products
            </h1>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {products?.map((product) => (
                    <Link key={product.slug} href={`/products/${product.slug}`}>
                        <Card key={product.slug} className="group">
                            <CardHeader>
                                <Image
                                    src={urlFor(product.mainImage).url()}
                                    alt={product.title}
                                    width={1920}
                                    height={1080}
                                    className="h-[250px] w-full rounded-lg object-cover object-bottom grayscale transition group-hover:grayscale-0"
                                />
                            </CardHeader>

                            <CardContent>
                                <CardTitle className="flex flex-wrap items-center justify-between">
                                    {product.title}{' '}
                                    {!product.price ? null : (
                                        <span className="text-sm">
                                            $ {product.price}
                                        </span>
                                    )}
                                </CardTitle>
                            </CardContent>

                            <CardFooter className="flex flex-wrap items-center justify-start gap-2">
                                {product.categories?.map((cat, index) => (
                                    <CardDescription
                                        key={index}
                                        className="rounded-full bg-neutral-800 px-2 text-sm"
                                    >
                                        {cat.categoryTitle}
                                    </CardDescription>
                                ))}
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
