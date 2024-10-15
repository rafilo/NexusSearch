import { z } from 'zod'
import { createUserFormSchema } from 'schema/create_user_schema'
import { Button } from 'components/UI/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/UI/form'
import { Input } from 'components/UI/input'
import { SelectWrapper } from 'components/UI/select_wrapper'
import { useToast } from 'components/UI/use_toast'
import axiosInstance from 'components/Hooks/axios_instance'
import {
  createUserDepartmentDropdown,
  createUserRoleDropdown,
} from 'components/Config/admin_user_setting_config'

export const CreateUserForm = (props) => {
  const { formItems, form, closeDialog } = props
  const { toast } = useToast()

  //  Define a submit handler.
  function onSubmit(values: z.infer<typeof createUserFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    toast({
      title: 'Create user triggered',
      description: 'sample text for create user',
    })
    closeDialog()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          {formItems.map((item) => (
            <FormField
              key={item.name}
              control={form.control}
              name={item.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{item.label}</FormLabel>
                  <FormControl>
                    {item.name === 'role' ? (
                      <SelectWrapper
                        selectItems={createUserRoleDropdown}
                        placeHolder={'select user role'}
                        onValueChange={(val) => {
                          field.onChange(val)
                        }}
                      />
                    ) : item.name === 'department' ? (
                      <SelectWrapper
                        selectItems={createUserDepartmentDropdown}
                        placeHolder={'select user department'}
                        onValueChange={(val) => {
                          field.onChange(val)
                        }}
                      />
                    ) : (
                      <Input placeholder={item.placeholder} {...field} />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <Button
          id="createUserSubmitButton"
          className="hidden float-right mt-10"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Form>
  )
}
