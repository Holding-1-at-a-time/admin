import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className=" lg:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center justify-center">
          <span className="text-xl font-bold">Admin Portal</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/auth/login" className="text-sm font-medium hover:underline underline-offset-4">
            Login
          </Link>
          <Link href="/auth/register" className="text-sm font-medium hover:underline underline-offset-4">
            Register
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container  md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Business Management Portal
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Manage your business operations, customers, and services all in one place.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/auth/login">
                  <Button>Get Started</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="outline">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center  md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 Admin Portal. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

