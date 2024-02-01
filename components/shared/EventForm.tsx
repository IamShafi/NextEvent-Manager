"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

import Image from "next/image"
import * as z from 'zod'
import "react-datepicker/dist/react-datepicker.css";

import { createEvent, updateEvent } from "@/lib/actions/event.actions"
import { IEvent } from "@/lib/database/models/event.model"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUploadThing } from '@/lib/uploadthing'
import { Checkbox } from "../ui/checkbox"
import { FileUploader } from "./FileUploader"
import DatePicker from "react-datepicker";

// import components
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { eventFormSchema } from "@/lib/validator"
import { eventDefaultValues } from "@/constants"
import Dropdown from "./Dropdown"
import { Textarea } from "@/components/ui/textarea"


// Define the props type for the EventForm component
type EventFormProps = {
  userId: string
  type: "Create" | "Update"
  event?: IEvent,
  eventId?: string
}

// Define the EventForm component
const EventForm = ({ userId, type, event, eventId }: EventFormProps) => {
  // State to manage uploaded files
  const [files, setFiles] = useState<File[]>([])
  
  // Set initial values based on whether it's an update or create operation
  const initialValues = event && type === 'Update' 
    ? { 
      ...event, 
      startDateTime: new Date(event.startDateTime), 
      endDateTime: new Date(event.endDateTime) 
    }
    : eventDefaultValues;
  
  // Get Next.js router instance
  const router = useRouter();

  // Custom hook to handle file uploads
  const { startUpload } = useUploadThing('imageUploader')

  // Initialize the react-hook-form
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialValues
  })

  // Handle form submission
  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    // Initialize the image URL with the form value
    let uploadedImageUrl = values.imageUrl;

    // Check if there are files to upload
    if(files.length > 0) {
      // Start the file upload process
      const uploadedImages = await startUpload(files)

      // Check if the upload was successful
      if(!uploadedImages) {
        return
      }

      // Update the image URL with the uploaded image URL
      uploadedImageUrl = uploadedImages[0].url
    }

    // Perform actions based on the operation type (Create or Update)
    if(type === 'Create') {
      try {
        // Create a new event and navigate to the user's profile
        const newEvent = await createEvent({
          event: { ...values, imageUrl: uploadedImageUrl },
          userId,
          path: '/profile'
        })

        // If successful, reset the form and navigate to the newly created event
        if(newEvent) {
          form.reset();
          router.push(`/events/${newEvent._id}`)
        }
      } catch (error) {
        console.log(error);
      }
    }

    if(type === 'Update') {
      if(!eventId) {
        // If no eventId is provided, navigate back
        router.back()
        return;
      }

      try {
        // Update an existing event and navigate to the updated event details page
        const updatedEvent = await updateEvent({
          userId,
          event: { ...values, imageUrl: uploadedImageUrl, _id: eventId },
          path: `/events/${eventId}`
        })

        // If successful, reset the form and navigate to the updated event
        if(updatedEvent) {
          form.reset();
          router.push(`/events/${updatedEvent._id}`)
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  // Render the form with various input fields and components
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* ... (code for rendering form fields) ... */}
        
        {/* Submit button for the form */}
        <Button 
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? (
            'Submitting...'
          ): `${type} Event `}</Button>
      </form>
    </Form>
  )
}

// Export the EventForm component as the default export
export default EventForm
