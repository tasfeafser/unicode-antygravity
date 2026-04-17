import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  
  const { method, body } = req;
  const url = new URL(req.url);
  const templateId = url.searchParams.get('id');
  
  // Upload template
  if (method === 'POST' && url.pathname === '/upload') {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const metadata = JSON.parse(formData.get('metadata') as string);
    
    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('unicode-ppt-templates')
      .upload(`templates/${file.name}`, file);
    
    if (uploadError) throw uploadError;
    
    // Save to database
    const { data: template, error: dbError } = await supabase
      .from('ppt_templates')
      .insert({
        name: metadata.name,
        description: metadata.description,
        category: metadata.category,
        file_path: `templates/${file.name}`,
        placeholder_schema: metadata.placeholders,
        is_public: metadata.isPublic || false
      })
      .select()
      .single();
    
    return new Response(JSON.stringify(template), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  }
  
  // List templates
  if (method === 'GET') {
    const { data, error } = await supabase
      .from('ppt_templates')
      .select('*')
      .order('usage_count', { ascending: false });
    
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response('Method not allowed', { status: 405 });
});
