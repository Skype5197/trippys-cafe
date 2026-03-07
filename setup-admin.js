import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ghddmfwaybzylincznfn.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZGRtZndheWJ6eWxpbmN6bmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzMyNDg1OCwiZXhwIjoyMDgyOTAwODU4fQ.NFoU3KCYCfHo6ql7vhdJF86pKOzN-dJwKSxpLubDCl0';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  console.log('1. Demoting existing admins by deleting admin roles...');
  const { error: deleteError } = await supabase
    .from('user_roles')
    .delete()
    .eq('role', 'admin');
    
  if (deleteError) {
    console.error('Error deleting existing admins:', deleteError);
  } else {
    console.log('Successfully demoted other admins.');
  }

  console.log('2. Creating or finding test admin account...');
  let userId;
  
  const email = 'admin@test.com';
  const password = 'password123';

  // List users
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
  
  const existingUser = usersData?.users?.find(u => u.email === email);

  if (existingUser) {
    console.log('User already exists, id:', existingUser.id);
    userId = existingUser.id;
  } else {
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError) {
      console.error('Error creating user:', createError);
      return;
    }
    console.log('Created new test user, id:', createData.user.id);
    userId = createData.user.id;
  }

  console.log('3. Assigning admin role to test account...');
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert({ user_id: userId, role: 'admin' });
    
  if (roleError) {
     if (roleError.code === '23505') { 
       console.log('Admin role already exists for this test account.');
     } else {
       console.error('Error assigning admin role:', roleError);
     }
  } else {
     console.log('Successfully assigned admin role!');
  }
}

main().catch(console.error);
