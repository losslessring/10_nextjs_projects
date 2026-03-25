import { Button } from '@/components/ui/button'
import { CardDescription } from '@/components/ui/card'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex h-screen items-center justify-center px-6 py-20 lg:py-0">
            <article className="space-y-6 text-center">
                <h1 className="text-3xl font-bold">404 Page not found</h1>
                <CardDescription>
                    The page you were looking for could not be found.
                </CardDescription>

                <Button variant="secondary" asChild>
                    <Link href="/">&larr; Back to homepage</Link>
                </Button>
            </article>
        </div>
    )
}
