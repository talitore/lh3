import React from "react";
import { Link } from "@inertiajs/react";
import DefaultLayout from "../layouts/DefaultLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  Gem,
  ShieldCheck,
  Zap,
  Code2,
  Palette,
  ArrowRight,
  CheckCircle,
  Star,
  ExternalLink,
  Play,
} from "lucide-react";
import { signUpPath } from "../routes";

/**
 * Renders the multi-section homepage with hero, features, technology stack, and call-to-action sections.
 *
 * The homepage introduces the full-stack solution combining Rails 8, Inertia.js, React, and shadcn/ui, highlighting key features and technologies. It provides navigation links for sign-up and viewing a demo or GitHub repository.
 *
 * @returns The homepage React element
 */
export default function Home() {
  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4 px-3 py-1">
              <Star className="mr-1 h-3 w-3" />
              New: Rails 8 + Tailwind v4 Support
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Build Modern Web Apps,{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Faster
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              The complete full-stack solution combining Rails 8, Inertia.js,
              React, and shadcn/ui. Ship production-ready applications with
              beautiful UI components and modern tooling.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href={signUpPath()}>
                <Button size="lg" className="h-12 px-8">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-12 px-8">
                <Play className="mr-2 h-4 w-4" />
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to build modern web apps
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              A carefully crafted stack that combines the best tools and
              practices for rapid development without compromising on quality.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary">
                    <Rocket className="h-5 w-5 text-primary-foreground" />
                  </div>
                  Rapid Development
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Pre-configured Rails 8 with Vite, Inertia.js, and React. Hot
                    reload, TypeScript support, and modern build tools out of
                    the box.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary">
                    <Palette className="h-5 w-5 text-primary-foreground" />
                  </div>
                  Beautiful Components
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Complete shadcn/ui component library with Tailwind CSS v4.
                    Accessible, customizable, and production-ready components.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary">
                    <ShieldCheck className="h-5 w-5 text-primary-foreground" />
                  </div>
                  Production Ready
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Built on Ruby on Rails with authentication, security best
                    practices, and deployment-ready configuration from day one.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-24 sm:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Modern Technology Stack
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Built with the latest and greatest tools for web development
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-red-500">
                    <Gem className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Ruby on Rails 8</CardTitle>
                    <CardDescription>
                      The web framework that scales
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Authentication & Authorization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Database Migrations & Models
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Background Jobs & Caching
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-500">
                    <Code2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>React + TypeScript</CardTitle>
                    <CardDescription>
                      Modern frontend development
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Type-safe development
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Component-based architecture
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Hot reload & fast refresh
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-500">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Inertia.js</CardTitle>
                    <CardDescription>The modern monolith</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    SPA-like experience
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    No API layer needed
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Server-side routing
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-cyan-500">
                    <Palette className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>shadcn/ui + Tailwind</CardTitle>
                    <CardDescription>
                      Beautiful, accessible components
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Copy & paste components
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Fully customizable
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Accessibility built-in
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to build something amazing?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Join thousands of developers who are building faster with our
              modern stack.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href={signUpPath()}>
                <Button size="lg" className="h-12 px-8">
                  Start Building Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-12 px-8">
                <ExternalLink className="mr-2 h-4 w-4" />
                View on GitHub
              </Button>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
