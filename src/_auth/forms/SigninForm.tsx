
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { SigninValidation } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Loader from "@/components/shared/Loader"

import { Link, useNavigate } from 'react-router-dom'

import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"


const SigninForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();


  // Queries
  const { mutateAsync: signInAccount } = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: '',
      password: ''
    },
  })



  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password
    })

    if (!session) {
      toast({
        title: 'Sign in failed, please try again.'
      })
    }

    const isLoggedIn = await checkAuthUser()

    if (isLoggedIn) {
      form.reset()

      navigate('/')
    } else {
      return toast({
        title: "Sign up failed, please try again.",
      })
    }
  }


  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="assets/images/logo.svg" alt="" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Login to your account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">Welcome back!, please enter your details</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full mt-4 gap-5 ">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input"{...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isUserLoading ? (
              <div className="flex-center gap-4">
                <Loader /> Loading...
              </div>
            ) : (
              'Sign In'
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?
            <Link to={'/sign-up'} className="text-primary-500 text-small-semibold ml-1">Sign Up</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm