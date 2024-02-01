'use server'
import { revalidatePath } from 'next/cache'
import { auth } from "@clerk/nextjs";
import { connectToDatabase } from '@/lib/database'
import Event from '@/lib/database/models/event.model'
import User from '@/lib/database/models/user.model'
import Category from '@/lib/database/models/category.model'
import { handleError } from '@/lib/utils'
import {
  CreateEventParams,
  UpdateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
} from '@/types'

// Utility function to find a category by name, case-insensitive
const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: 'i' } })
}

// Utility function to populate related data in the event query
const populateEvent = (query: any) => {
  return query
    .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
    .populate({ path: 'category', model: Category, select: '_id name' })
}

// CREATE
export async function createEvent({ userId, event, path }: CreateEventParams) {
  try {
    // Connect to the database
    await connectToDatabase()

    // Find the user by 'clerkId' and convert it to MongoDB ObjectId
    const organizer = await User.findOne({ clerkId: userId });
    if (!organizer) throw new Error('Organizer not found')
    else {
      userId = organizer._id;
    }

    // Create a new event and revalidate the specified path
    const newEvent = await Event.create({ ...event, category: event.categoryId, organizer: userId })
    revalidatePath(path)

    return JSON.parse(JSON.stringify(newEvent))
  } catch (error) {
    handleError(error)
  }
}

// GET ONE EVENT BY ID
export async function getEventById(eventId: string) {
  try {
    // Connect to the database
    await connectToDatabase()

    // Retrieve the event by ID and populate related data
    const event = await populateEvent(Event.findById(eventId))

    if (!event) throw new Error('Event not found')

    return JSON.parse(JSON.stringify(event))
  } catch (error) {
    handleError(error)
  }
}

// UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    // Connect to the database
    await connectToDatabase()

    // Find the event to update and check for authorization
    const eventToUpdate = await Event.findById(event._id)
    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error('Unauthorized or event not found')
    }

    // Update the event and revalidate the specified path
    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true }
    )
    revalidatePath(path)

    return JSON.parse(JSON.stringify(updatedEvent))
  } catch (error) {
    handleError(error)
  }
}

// DELETE
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    // Connect to the database
    await connectToDatabase()

    // Delete the specified event and revalidate the specified path
    const deletedEvent = await Event.findByIdAndDelete(eventId)
    if (deletedEvent) revalidatePath(path)
  } catch (error) {
    handleError(error)
  }
}

// GET ALL EVENTS
export async function getAllEvents({ query, limit = 6, page, category }: GetAllEventsParams) {
  try {
    // Connect to the database
    await connectToDatabase()

    // Define conditions based on query and category
    const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
    const categoryCondition = category ? await getCategoryByName(category) : null
    const conditions = {
      $and: [titleCondition, categoryCondition ? { category: categoryCondition._id } : {}],
    }

    // Calculate skip amount based on pagination parameters
    const skipAmount = (Number(page) - 1) * limit

    // Query events, sort by creation date, skip, and limit
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    // Populate related data in the events query
    const events = await populateEvent(eventsQuery)

    // Count total events matching the conditions
    const eventsCount = await Event.countDocuments(conditions)

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    }
  } catch (error) {
    handleError(error)
  }
}

// GET EVENTS BY ORGANIZER
export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
  try {
    // Connect to the database
    await connectToDatabase()

    // Define conditions to retrieve events by organizer
    const conditions = { organizer: userId }

    // Calculate skip amount based on pagination parameters
    const skipAmount = (page - 1) * limit

    // Query events by organizer, sort by creation date, skip, and limit
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    // Populate related data in the events query
    const events = await populateEvent(eventsQuery)

    // Count total events matching the conditions
    const eventsCount = await Event.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    // Connect to the database
    await connectToDatabase()

    // Calculate skip amount based on pagination parameters
    const skipAmount = (Number(page) - 1) * limit

    // Define conditions to retrieve related events with the same category
    const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }

    // Query related events, sort by creation date, skip, and limit
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    // Populate related data in the events query
    const events = await populateEvent(eventsQuery)

    // Count total related events matching the conditions
    const eventsCount = await Event.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}
