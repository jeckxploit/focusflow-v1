import { supabase } from "./supabase"

export const getAllPublicPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export const getPostById = async (id: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw new Error(error.message)
  return data
}