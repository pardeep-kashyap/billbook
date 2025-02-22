'use client'

import * as React from 'react'

// import { UserSubscriptionPlan } from "types";
import { cn, formatDate } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { Icons } from '@/components/icons'

// interface BillingFormProps extends React.HTMLAttributes<HTMLFormElement> {
//   subscriptionPlan: UserSubscriptionPlan & {
//     isCanceled: boolean;
//   };
// }

export function BillingForm(props: any) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(event: any) {
    event.preventDefault()
    setIsLoading(!isLoading)

    // Get a Stripe session URL.
    const response = await fetch('/api/users/stripe')

    if (!response?.ok) {
      return toast({
        title: 'Something went wrong.',
        description: 'Please refresh the page and try again.',
        variant: 'destructive',
      })
    }

    // Redirect to the Stripe session.
    // This could be a checkout page for initial upgrade.
    // Or portal to manage existing subscription.
    const session = await response.json()
    if (session) {
      window.location.href = session.url
    }
  }

  return (
    <form onSubmit={onSubmit} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            You are currently on the <strong>Pardeep</strong> plan.
          </CardDescription>
        </CardHeader>
        <CardContent>flex-col items-start</CardContent>
        <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
          <button
            type="submit"
            className={cn(buttonVariants())}
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {/* {subscriptionPlan.isPro ? "Manage Subscription" : "Upgrade to PRO"} */}
          </button>
          <p className="rounded-full text-xs font-medium">
            {/* {subscriptionPlan.isCanceled */}
            {/* ? "Your plan will be canceled on " */}
            Your plan renews on
            {/* {formatDate(subscriptionPlan.stripeCurrentPeriodEnd)}. */}
          </p>
        </CardFooter>
      </Card>
    </form>
  )
}
