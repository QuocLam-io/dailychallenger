# Phone Number Validation & Auto-Formatting Implementation

## Overview
This document explains the chronological flow of phone number validation and auto-formatting in the ChallengerForm component.

---

## 1. Initial Setup (Component Mount)

### State Variables
```tsx
const [phoneNumber, setPhoneNumber] = useState<string>("");
const [phoneError, setPhoneError] = useState<string>("");
```

### Zod Validation Schema
```tsx
const phoneSchema = z.string().refine(
  (val) => {
    if (val === "") return true; // Allow empty (optional field)
    const digitsOnly = val.replace(/\D/g, ""); // Strip formatting
    return digitsOnly.length === 10; // Must be exactly 10 digits
  },
  { message: "Phone number must be 10 digits" }
);
```

---

## 2. User Types in Input Field

### Step-by-step Flow:

**User types: "5"**
1. `onChange` event fires
2. Calls `handlePhoneChange("5")`
3. Inside `handlePhoneChange`:
   - Calls `formatPhoneNumber("5")`
   - `formatPhoneNumber` strips non-digits: `"5"` → `"5"`
   - Applies format logic: `"(5"`
   - Returns `"(5"`
4. `setPhoneNumber("(5")` updates state
5. Input displays: `(5`

**User continues typing: "55"**
1. Input value is currently `"(5"`, user types another `5`
2. `onChange` fires with value `"(55"` (or browser might give `"(55"`)
3. `handlePhoneChange("(55")` is called
4. `formatPhoneNumber("(55")`:
   - Strips non-digits: `"(55"` → `"55"`
   - Applies format: `"(55"`
5. Input displays: `(55`

**User completes area code: "555"**
1. `handlePhoneChange("(555")`
2. `formatPhoneNumber("(555")`:
   - Strips: `"555"`
   - Format (3 digits): `"(555"`
3. Input displays: `(555`

**User adds 4th digit: "5558"**
1. `formatPhoneNumber` receives any variation of input
2. Strips to: `"5558"`
3. Format logic (4-6 digits): `(555) 8`
4. Input displays: `(555) 8`

**User completes phone: "5558675309"**
1. Final format applied:
   - Strips: `"5558675309"`
   - Format (7-10 digits): `(555) 867-5309`
2. Input displays: `(555) 867-5309`

---

## 3. Format Function Logic

### `formatPhoneNumber(value: string)`

```tsx
const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, ""); // Remove all non-digits

  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};
```

**Format Patterns by Length:**
- 0 digits: `""`
- 1-3 digits: `(###`
- 4-6 digits: `(###) ###`
- 7-10 digits: `(###) ###-####`

**Examples:**
- `"5"` → `"(5"`
- `"555"` → `"(555"`
- `"5558"` → `"(555) 8"`
- `"5558675309"` → `"(555) 867-5309"`
- `"55586753099999"` → `"(555) 867-5309"` (truncates at 10 digits)

---

## 4. Error Clearing While Typing

Inside `handlePhoneChange`:
```tsx
if (phoneError) {
  setPhoneError(""); // Clear error as user types
}
```

**Why?**
- Immediate feedback: once user starts fixing the issue, error disappears
- Better UX than showing error while actively typing

---

## 5. Form Submission

### User clicks "Create" button

**Step 1: Form submit handler**
```tsx
const submitChallengeHandler = async (e: React.FormEvent) => {
  e.preventDefault();

  // ... other validations

  // Validate phone number if provided
  if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
    return; // Stop submission if invalid
  }

  setIsSubmitting(true);
  // ... continue with challenge creation
}
```

**Step 2: Validation**
```tsx
const validatePhoneNumber = (value: string) => {
  const result = phoneSchema.safeParse(value);
  if (!result.success) {
    setPhoneError(result.error.errors[0].message);
    return false;
  }
  setPhoneError("");
  return true;
};
```

**Step 3: Zod validation runs**
- Example: `"(555) 867-5309"`
- Strips to: `"5558675309"`
- Length check: `10 === 10` ✅
- Returns: `{ success: true }`

**Step 4: Phone number sent to SMS service**
```tsx
if (phoneNumber) {
  await sendSurgeSMS({
    phoneNumber, // "(555) 867-5309"
    message: `${emoji} ${userName}'s doing the challenge...`
  });
}
```

---

## 6. Error States

### Invalid Phone Number (less than 10 digits)

**User enters: "555867"**
1. Auto-formats to: `(555) 867`
2. User clicks "Create"
3. `validatePhoneNumber("(555) 867")` runs
4. Strips to: `"555867"` (6 digits)
5. Validation fails: `6 !== 10`
6. `setPhoneError("Phone number must be 10 digits")`
7. Error displays below input
8. Input gets red underline (`.error` class)
9. Form submission stops

### Error Display (in JSX)
```tsx
<input
  className={phoneError ? "error" : ""}
  // ... other props
/>
{phoneError && (
  <span className="error-message">{phoneError}</span>
)}
```

**Styling (SCSS):**
```scss
input.error {
  border-bottom: 2px solid #ef4444; // Red underline
}

.error-message {
  color: #ef4444; // Red text
  font-size: 12px;
}
```

---

## 7. Edge Cases Handled

### Copy/Paste
- User pastes: `"555-867-5309"`
- `formatPhoneNumber` strips and reformats: `"(555) 867-5309"`

### Multiple formats accepted on paste
- `"5558675309"` → `"(555) 867-5309"`
- `"555-867-5309"` → `"(555) 867-5309"`
- `"+1 (555) 867-5309"` → `"(555) 867-5309"`
- All become same format automatically

### Deleting characters
- User backspaces from `"(555) 867-5309"`
- Each deletion strips and reformats
- `"(555) 867-530"` → `"(555) 867-53"`
- Natural deletion behavior maintained

### Empty field (optional)
- Empty string: `""`
- Validation: `if (val === "") return true;`
- No error shown
- Form can submit without phone number

---

## 8. Component Location

**File:** `/src/components/ChallengerForm.tsx`

**Lines:**
- Zod schema: ~lines 40-52
- Format function: ~lines 190-199
- Handle change: ~lines 201-208
- Validation: ~lines 180-188
- JSX input: ~lines 363-377

**Styling:** `/src/components/ChallengerForm.scss` lines 125-138

---

## Summary Flow Diagram

```
User Types "5558675309"
    ↓
onChange event fires
    ↓
handlePhoneChange(value)
    ↓
formatPhoneNumber(value)
    ↓
Strip non-digits: "5558675309"
    ↓
Apply format: "(555) 867-5309"
    ↓
setPhoneNumber("(555) 867-5309")
    ↓
Input displays formatted value
    ↓
User clicks "Create"
    ↓
validatePhoneNumber("(555) 867-5309")
    ↓
Zod schema strips & validates
    ↓
10 digits? ✅ → Continue submission
         ❌ → Show error, stop submission
```
