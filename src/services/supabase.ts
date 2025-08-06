import { supabase } from '../../supabase/config';
import type { Profile, Photography, Project, Tag } from '../../supabase/config';

// Auth Services
export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  },
};

// Profile Services
export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  async uploadAvatar(userId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);
    
    if (error) return { data: null, error };
    
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);
    
    return { data: publicUrl, error: null };
  },
};

// Photography Services
export const photographyService = {
  async getPhotography() {
    const { data, error } = await supabase
      .from('photography')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getPhotographyById(id: string) {
    const { data, error } = await supabase
      .from('photography')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async createPhotography(photography: Omit<Photography, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('photography')
      .insert(photography)
      .select()
      .single();
    return { data, error };
  },

  async updatePhotography(id: string, updates: Partial<Photography>) {
    const { data, error } = await supabase
      .from('photography')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deletePhotography(id: string) {
    const { error } = await supabase
      .from('photography')
      .delete()
      .eq('id', id);
    return { error };
  },

  async uploadImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('photography')
      .upload(fileName, file);
    
    if (error) return { data: null, error };
    
    const { data: { publicUrl } } = supabase.storage
      .from('photography')
      .getPublicUrl(fileName);
    
    return { data: publicUrl, error: null };
  },
};

// Project Services
export const projectService = {
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getProjectById(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    return { data, error };
  },

  async updateProject(id: string, updates: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    return { error };
  },

  async uploadProjectImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('projects')
      .upload(fileName, file);
    
    if (error) return { data: null, error };
    
    const { data: { publicUrl } } = supabase.storage
      .from('projects')
      .getPublicUrl(fileName);
    
    return { data: publicUrl, error: null };
  },
};

// Tag Services
export const tagService = {
  async getTags(category?: 'photography' | 'project') {
    let query = supabase.from('tags').select('*');
    if (category) {
      query = query.eq('category', category);
    }
    const { data, error } = await query.order('name');
    return { data, error };
  },

  async createTag(tag: Omit<Tag, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('tags')
      .insert(tag)
      .select()
      .single();
    return { data, error };
  },

  async deleteTag(id: string) {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);
    return { error };
  },
};

// Contact Services
export const contactService = {
  async submitContact(formData: { name: string; email: string; subject?: string; message: string }) {
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'Consulta general',
        message: formData.message,
        status: 'new'
      })
      .select()
      .single();
    return { data, error };
  },

  async getContacts() {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async updateContactStatus(id: string, status: 'new' | 'read' | 'replied') {
    const { data, error } = await supabase
      .from('contacts')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },
};
