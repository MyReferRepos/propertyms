# Testing Guide - Property Information Enhancement

## 🎯 What to Test

This guide helps you verify that all the comprehensive property information is displaying correctly.

---

## 🚀 Quick Start

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Login** with test credentials:
   - Email: `admin@example.com`
   - Password: `NewPass@123`

3. **Navigate to Properties**:
   - Click on "Properties" in the sidebar
   - Or go directly to: `http://localhost:5173/properties`

4. **View the detailed property**:
   - Click on the first property: **"99 Bruce McLaren Rd"**
   - Or go directly to: `http://localhost:5173/properties/prop-001`

---

## ✅ Expected Information to See

When you view `prop-001` (99 Bruce McLaren Rd), you should see ALL of the following sections:

### 1. ✅ Basic Information Card
- **Address**: 99 Bruce McLaren Rd, Henderson, Auckland 0612, New Zealand
- **Area**: West
- **Dwelling Type**: House / Townhouse
- **"Show map" button** (right side)

### 2. ✅ Room Information Card
Should display a grid with:
- **Bedroom**: 3
- **Living area**: 1
- **Bathroom**: 2
- **Separate toilet**: 1
- **Floor Plan**: Yes (with "View Plan" link)
- **Study room**: 1
- **Family Lounge**: 0
- **Laundry room**: 1
- **No of shed**: 1

### 3. ✅ Parking Information Card
- **Car space**: "Single freestanding garage with automatic door. Double internal garage. Triple garage space."
- **Special info**: "Garage converted to storage room."

### 4. ✅ Amenities & Features Card
Should show Yes/No for:
- Swimming pool: No
- SPA: No
- Clothesline: Yes
- Off-street Parking: Yes
- Lawn: Yes
- Garden: Fully fenced

### 5. ✅ Utilities & Services Card
Should display:
- **Gas**: Yes - Nature gas from main pipe (ICP: ICP-123456789)
- **Electricity ICP and location**: ICP-987654321 - External meter box on north wall
- **Water Meter no and location**: WATER-556677 - Front boundary, left side
- **Septic Tank**: No
- **Water filter system**: No
- **Internet**: Fibre installed
- **HRV system**: No
- **Smoke alarm complied**: Yes
- **Fireplace**: Yes

### 6. ✅ Chattel List Card
**Main Chattels**:
Should see a comma-separated list including:
- Rangehood *1
- Extractor Fan *2
- Heat Pump *1
- Dishwasher *1
- Waste Disposal unit *1
- TV antenna *1
- Stove *1
- Cook top *1
- Under bench Oven *1

**Additional Chattel list** (Not affect tenants):
- Double bed *1
- Side table *2
- Dining table *1

### 7. ✅ Insurance Card
Should display:
- **Insurance**: Yes
- **Insurer**: AA Insurance
- **Policy**: POL-2024-556677
- **Excess Fee**: $500
- **Expire on specific date?**: Yes on 23 May 2025

### 8. ✅ Healthy Home Compliance Card
Should show:
- ✅ Green checkmark with "Yes on 23 May 2024"
- **Compliance certificate attachment** (with "View" button)
- Updated on: 25 May 2024

### 9. ✅ Key Info Card
Should display:
- Main Entrance Door *2
- Back door *1
- Sliding door *2
- Garage remote: 2
- Note about "attachments of photo for keys"
- "View Keys Photo" button

### 10. ✅ Hazards or Risk Card
Should show **orange border** with warning icon:
- **Yes**
- Three hazard items:
  1. **Dogs**: Previous tenants had dogs. Property has been professionally cleaned.
  2. **Asbestos**: Asbestos tested present in garage roof. Encapsulated and safe, no removal required.
  3. **Physical Danger** (red badge): Steep driveway - caution in wet weather.

### 11. ✅ Rental Appraisal (AI tech) Card
Should show **blue background**:
- **Last generated**: 1 November 2024
- **Suggested Weekly Rent**: $780 (in large blue text)
- "View Report" button
- "Generate New Appraisal" button

---

## 🔍 Visual Verification Checklist

Use this checklist while testing:

- [ ] All 11 sections are visible and properly rendered
- [ ] Icons appear next to section titles (Home, Car, Zap, Shield, Key, etc.)
- [ ] Color-coded elements:
  - [ ] Green checkmark for Healthy Homes compliance
  - [ ] Orange border for Hazards card
  - [ ] Red "physical danger" badge
  - [ ] Blue background for AI Appraisal
- [ ] Buttons are clickable (even if not functional yet)
- [ ] Property image appears at the top
- [ ] "Back to Properties" link works
- [ ] Status badge shows "Occupied" in blue

---

## 🌐 Language Switching Test

1. **Switch to Chinese**:
   - Click the language switcher (top right)
   - Select "中文"

2. **Verify translations**:
   - Section headers should be in Chinese
   - Field names should be translated
   - Example: "Room Information" → "房间信息"

3. **Switch back to English**:
   - Select "English"
   - Verify everything switches back

---

## 🔄 Compare with Other Properties

1. **Go back to properties list**
2. **Click on prop-002** (15 Queen Street)
3. **Observe**:
   - This property has basic information only
   - Many advanced sections won't show (because data is missing)
   - This demonstrates **conditional rendering** - sections only appear when data exists

---

## 🐛 Common Issues & Solutions

### Issue: Can't see all the sections
**Solution**: Make sure you're viewing `prop-001` (99 Bruce McLaren Rd), not other properties. Only prop-001 has comprehensive data.

### Issue: Build errors
**Solution**: Run `npm run build` to check for TypeScript errors. The latest commit should build successfully.

### Issue: Translations not working
**Solution**: Check that you're on the `feature/property-info-enhancement` branch and all files are up to date.

### Issue: Page shows "Property Not Found"
**Solution**:
1. Check the URL - should be `/properties/prop-001`
2. Verify you're logged in
3. Check browser console for errors

---

## 📸 Screenshot Comparison

Compare what you see with the original screenshots provided:

**Screenshot 1 Features** ✅:
- ✅ Room details (bedrooms, bathrooms, separate toilet, etc.)
- ✅ Parking description
- ✅ Amenities (pool, SPA, clothesline, etc.)
- ✅ Utilities (gas, electricity, water, internet, etc.)
- ✅ Chattels list

**Screenshot 2 Features** ✅:
- ✅ Additional chattels
- ✅ Insurance details
- ✅ Healthy Homes compliance
- ✅ Keys information
- ✅ Hazards with details
- ✅ AI Rental Appraisal

---

## 📊 Performance Check

The page should:
- Load in < 2 seconds
- Render smoothly without flickering
- Handle image loading gracefully
- Show loading spinner while fetching data

---

## 🎉 Success Criteria

Your test is successful if:

✅ All 11 sections display correctly for prop-001
✅ Icons and colors are properly rendered
✅ No console errors in browser DevTools
✅ Language switching works for all new fields
✅ Conditional rendering works (other properties show less info)
✅ Page is responsive and looks good on different screen sizes

---

## 📝 Reporting Issues

If you find any issues, please note:
1. Which property you were viewing
2. Which section has the problem
3. What you expected vs what you saw
4. Browser and screen size
5. Any console errors

---

**Happy Testing! 🚀**
