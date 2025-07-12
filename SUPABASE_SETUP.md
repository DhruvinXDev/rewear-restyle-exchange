# Supabase Database Setup

## 🗄️ Database Schema Setup

To set up your Supabase database with the required tables and functions, follow these steps:

### 1. **Access Supabase Dashboard**
- Go to [supabase.com](https://supabase.com)
- Sign in to your account
- Select your project

### 2. **Run the SQL Schema**
- Go to the **SQL Editor** in your Supabase dashboard
- Copy and paste the contents of `supabase/schema.sql`
- Click **Run** to execute the SQL

### 3. **Verify Tables Created**
After running the SQL, you should see these tables in your **Table Editor**:
- `user_profiles` - User profile information
- `listings` - Clothing listings
- `swap_history` - Swap transactions
- `points_history` - Points tracking

### 4. **Storage Setup (Optional)**
For avatar uploads, create a storage bucket:
- Go to **Storage** in your dashboard
- Create a new bucket called `avatars`
- Set it to public
- Update the RLS policies as needed

### 5. **Test the Setup**
The schema includes sample data for testing:
- Admin user: `admin@rewear.com`
- Test users: `user1@example.com`, `user2@example.com`

## 🔧 Database Functions

The schema includes these functions:
- `increment_points(user_id, points_to_add)` - Adds points to a user
- `update_updated_at_column()` - Auto-updates timestamps

## 🔐 Row Level Security (RLS)

The schema includes RLS policies for:
- Users can only view/edit their own profiles
- Users can view all approved listings
- Users can only see swaps they're involved in
- Users can only see their own points history

## 🚀 Next Steps

1. **Test the Profile Page**: Visit `/profile` after logging in
2. **Set Up Admin Access**: Follow the admin setup instructions below
3. **Test Admin Panel**: Use the admin login to access `/admin`
4. **Add Sample Data**: Use the SQL editor to add more test data

## 🔐 Admin Setup Instructions

### Step 1: Create Admin User in Supabase Auth
1. Go to your Supabase Dashboard > **Authentication** > **Users**
2. Click **"Add User"**
3. Enter admin details:
   - Email: `admin@rewear.com` (or your preferred admin email)
   - Password: Choose a strong password
4. Click **"Create User"**
5. Copy the **User ID** (you'll need this for the next step)

### Step 2: Create Admin Profile
1. Go to **SQL Editor** in your Supabase dashboard
2. Open the file `scripts/create-admin.sql`
3. Replace `'YOUR_ADMIN_USER_ID'` with the actual User ID from Step 1
4. Run the SQL script

### Step 3: Test Admin Access
1. Visit `/admin-login` on your website
2. Login with your admin credentials
3. You should be redirected to the admin panel
4. If you get "Access Denied", check that the role is set to 'admin' in the database

## 📝 Notes

- The `user_profiles` table references `auth.users` from Supabase Auth
- All timestamps are automatically managed
- Points are tracked with a history table for transparency
- Referral codes are auto-generated for each user

## 🔍 Troubleshooting

If you encounter issues:
1. Check the **Logs** in your Supabase dashboard
2. Verify RLS policies are enabled
3. Ensure your API keys are correct in `src/integrations/supabase/client.ts`
4. Check that the database types match in `src/integrations/supabase/types.ts` 