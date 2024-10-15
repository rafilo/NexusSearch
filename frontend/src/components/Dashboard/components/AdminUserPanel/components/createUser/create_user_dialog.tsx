import { Button } from 'components/UI/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'components/UI/dialog'
import { createUserConfig } from 'components/Config/admin_user_setting_config'
import { useState, useRef } from 'react'
import { CreateUserForm } from './create_user_form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createUserFormSchema } from 'schema/create_user_schema'

export const CreateUserDialog = ({ triggerButton }) => {
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof createUserFormSchema>>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      department: '',
      role: '',
    },
  })

  const closeDialog = () => {
    setOpen(false)
    return
  }

  const handleSubmit = () => {
    const submitButton = document.getElementById("createUserSubmitButton")
    submitButton?.click()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{createUserConfig.title}</DialogTitle>
          <DialogDescription>{createUserConfig.description}</DialogDescription>
        </DialogHeader>
        <div className="gap-4 py-5 sm:max-h-[500px] overflow-y-auto">
          <CreateUserForm
            formItems={createUserConfig.formItems}
            form={form}
            closeDialog={closeDialog}
          />
        </div>
        <DialogFooter>
          <Button onClick={()=>{
            handleSubmit()
          }}>Create User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
