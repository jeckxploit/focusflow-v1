import { supabase } from "./supabase"

export const getPosts = async (userId: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export const getPublicPosts = async (userId: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "published")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export const createPost = async (title: string, content: string, status: 'draft' | 'published' = 'draft') => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { data, error } = await supabase.from("posts").insert([
    {
      title,
      content,
      status,
      user_id: user.id,
    },
  ])

  if (error) throw error
  return data
}

export const updatePost = async (id: string, updates: { title?: string, content?: string, status?: 'draft' | 'published' }) => {
  const { error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", id)
    
  if (error) throw error
}

export const deletePost = async (id: string, userId: string) => {
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .eq("user_id", userId) 
    
  if (error) throw error
}