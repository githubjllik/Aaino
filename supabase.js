import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cfisapjgzfdpwejkjcek.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmaXNhcGpnemZkcHdlamtqY2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MjI1MjIsImV4cCI6MjA0ODI5ODUyMn0.s9rW3qacaJfksz0B2GeW46OF59-1xA27eDhSTzTCn_8';

export const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseManager {
    constructor() {
        this.supabase = supabase;
    }

    async uploadImage(file, path) {
        try {
            const { data, error } = await this.supabase.storage
                .from('publications')
                .upload(path, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;
            return data.path;
        } catch (error) {
            console.error('Erreur lors de l\'upload de l\'image:', error);
            throw error;
        }
    }

    async createPublication(publicationData) {
        try {
            const { data, error } = await this.supabase
                .from('publications')
                .insert([publicationData])
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Erreur lors de la création de la publication:', error);
            throw error;
        }
    }

    async getPublications(filters = {}) {
        try {
            let query = this.supabase
                .from('publications')
                .select('*')
                .order('created_at', { ascending: false });

            if (filters.type) {
                query = query.eq('type', filters.type);
            }

            if (filters.section) {
                query = query.contains('sections', [filters.section]);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erreur lors de la récupération des publications:', error);
            throw error;
        }
    }

    async deletePublication(id) {
        try {
            const { data: publication } = await this.supabase
                .from('publications')
                .select('image_path')
                .eq('id', id)
                .single();

            if (publication?.image_path) {
                await this.supabase.storage
                    .from('publications')
                    .remove([publication.image_path]);
            }

            const { error } = await this.supabase
                .from('publications')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Erreur lors de la suppression de la publication:', error);
            throw error;
        }
    }
}
