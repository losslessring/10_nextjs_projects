import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { format } from 'date-fns'
import { groq, PortableText } from 'next-sanity'
import Image from 'next/image'
import Link from 'next/link'

export default async function SingleProduct({ params }) {
    const slug = await params

    async function getSingleProduct() {
        return client.fetch(
            groq`*[_type == "product" && slug.current == "${slug.slug}"][0] {
          title,
          "slug": slug.current,
          body,
          mainImage {
            asset -> {
            url
            }
          },
          publishedAt,
          price,
          rating,
          categories[] -> {
            "categoryTitle": title
          },
          "publisherName": author -> name,
          "publisherImage": author -> image,
          "publisherBio": author -> bio
        }`,
            { slug }
        )
    }

    getSingleProduct()

    const product = await getSingleProduct()

    return (
        <div className="container mx-auto px-6 py-20">
            {product ? (
                <div className="space-y-8">
                    <Button asChild variant="default">
                        <Link href="/products">&larr; Back</Link>
                    </Button>

                    <div>
                        {product.mainImage && product.mainImage.asset.url ? (
                            <div
                                style={{
                                    background: `url(${product.mainImage.asset.url})`,
                                    backgroundSize: 'contain',
                                }}
                                className="h-[500px] w-full rounded-lg"
                            >
                                <div className="flex h-[500px] items-center justify-center bg-black/50">
                                    <article className="mx-auto max-w-lg space-y-4 text-center">
                                        <h1 className="text-4xl font-bold text-white lg:text-5xl">
                                            {product.title}
                                        </h1>
                                        {product.publisherName && (
                                            <CardTitle>
                                                By {product.publisherName}
                                            </CardTitle>
                                        )}

                                        <ul className="flex flex-wrap items-center justify-center gap-2">
                                            {product.categories.map(
                                                (cat, index) => (
                                                    <CardDescription
                                                        key={index}
                                                        className="cursor-pointer rounded-full bg-neutral-800 px-4 py-1 text-sm text-white/50 transition hover:bg-neutral-900"
                                                    >
                                                        {cat.categoryTitle}
                                                    </CardDescription>
                                                )
                                            )}
                                        </ul>
                                    </article>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[500px] w-full rounded-lg border border-neutral-900"></div>
                        )}
                    </div>

                    <div>
                        <div className="grid gap-8 rounded-lg border border-neutral-800 md:grid-cols-2">
                            <CardHeader>
                                <Image
                                    src={urlFor(product.mainImage).url()}
                                    width={1600}
                                    height={1200}
                                    className="w-auto rounded-lg"
                                    alt={product.title}
                                />
                            </CardHeader>

                            <CardContent className="space-y-4 pt-4">
                                <CardDescription>
                                    Last updated:{' '}
                                    {format(
                                        new Date(product.publishedAt),
                                        'do MMMM yyyy'
                                    )}
                                </CardDescription>

                                <ul className="flex flex-wrap items-center justify-start gap-2">
                                    {product.categories.map((cat, index) => (
                                        <CardDescription
                                            key={index}
                                            className="cursor-pointer rounded-full bg-neutral-800 px-4 py-1 text-sm text-white/50 transition hover:bg-neutral-900"
                                        >
                                            {cat.categoryTitle}
                                        </CardDescription>
                                    ))}
                                </ul>

                                <article className="portabletext">
                                    <PortableText value={product.body} />

                                    {product.rating ? (
                                        <p className="mt-4 inline-block rounded-lg bg-neutral-900 px-4 text-muted-foreground">
                                            {product.rating} stars
                                        </p>
                                    ) : (
                                        <p className="mt-4 inline-block rounded-lg bg-neutral-900 px-4 text-muted-foreground">
                                            No rating yet
                                        </p>
                                    )}

                                    <div className="mt-6 flex flex-wrap gap-4">
                                        {product.price && (
                                            <CardTitle className="text-2xl lg:text-3xl">
                                                $ {product.price}
                                            </CardTitle>
                                        )}
                                        <Button
                                            variant="secondary"
                                            className="w-full font-semibold sm:w-auto"
                                        >
                                            Buy Now
                                        </Button>
                                    </div>
                                </article>
                            </CardContent>
                        </div>
                    </div>

                    {!product.publisherName ||
                    !product.publisherBio ||
                    !product.publisherImage ? null : (
                        <Card className="lg:max-w-3xl">
                            <CardHeader>
                                <CardTitle className="mb-4">
                                    About the publisher
                                </CardTitle>

                                {product.publisherImage ? (
                                    <div>
                                        <Image
                                            src={urlFor(
                                                product.publisherImage
                                            ).url()}
                                            width={80}
                                            height={80}
                                            alt={product.publisherName}
                                            className="rounded-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="size-[80px] rounded-full border border-neutral-900 bg-black"></div>
                                )}
                            </CardHeader>

                            <CardContent>
                                {product.publisherName && (
                                    <CardTitle className="mb-2">
                                        {product.publisherName}
                                    </CardTitle>
                                )}
                                {product.publisherBio && (
                                    <div className="portabletext">
                                        <PortableText
                                            value={product.publisherBio}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            ) : (
                <p className="text-center text-sm text-neutral-600">
                    Loading product details...
                </p>
            )}
        </div>
    )
}
