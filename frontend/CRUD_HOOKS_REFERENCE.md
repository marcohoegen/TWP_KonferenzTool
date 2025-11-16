# CRUD Hooks Reference - Auto-generated React Query Hooks

✅ **All hooks verified and working!**

## Summary

Your auto-generated hooks provide complete CRUD operations for all 5 resources:

- ✅ **Admins** - Full CRUD + Auth (Login/Logout/Me)
- ✅ **Conferences** - Full CRUD
- ✅ **Presentations** - Full CRUD
- ✅ **Ratings** - Full CRUD
- ✅ **Users** - Full CRUD

---

## 1. Admin CRUD Operations

### Import

```typescript
import {
  useAdminAdminControllerCreate,
  useAdminAdminControllerFindAll,
  useAdminAdminControllerFindOne,
  useAdminAdminControllerUpdate,
  useAdminAdminControllerRemove,
  useAdminAdminControllerLogin,
  useAdminAdminControllerLogout,
  useAdminAdminControllerMe,
} from "./api/generate/hooks/AdminService.hooks";
```

### Usage Examples

**Create (POST)**

```typescript
const createAdmin = useAdminAdminControllerCreate();
createAdmin.mutate({
  name: "John Doe",
  email: "john@example.com",
  password: "secure123",
});
```

**Read All (GET)**

```typescript
const {
  data: admins,
  isLoading,
  error,
} = useAdminAdminControllerFindAll(undefined, undefined);
```

**Read One (GET)**

```typescript
const { data: admin } = useAdminAdminControllerFindOne([1], undefined);
```

**Update (PATCH)**

```typescript
const updateAdmin = useAdminAdminControllerUpdate();
updateAdmin.mutate([1, { name: "Jane Doe" }]);
```

**Delete (DELETE)**

```typescript
const deleteAdmin = useAdminAdminControllerRemove();
deleteAdmin.mutate(1);
```

**Login (POST)**

```typescript
const login = useAdminAdminControllerLogin();
login.mutate({
  email: "admin@example.com",
  password: "password123",
});
```

**Logout (POST)**

```typescript
const logout = useAdminAdminControllerLogout();
logout.mutate({});
```

**Get Current User (GET)**

```typescript
const { data: currentUser } = useAdminAdminControllerMe(undefined, undefined);
```

---

## 2. Conference CRUD Operations

### Import

```typescript
import {
  useConferenceConferenceControllerCreate,
  useConferenceConferenceControllerFindAll,
  useConferenceConferenceControllerFindOne,
  useConferenceConferenceControllerUpdate,
  useConferenceConferenceControllerRemove,
} from "./api/generate/hooks/ConferenceService.hooks";
```

### Usage Examples

**Create (POST)**

```typescript
const createConference = useConferenceConferenceControllerCreate();
createConference.mutate({
  name: "Tech Summit 2025",
  location: "Berlin",
  startDate: "2025-06-01T00:00:00.000Z", // ISO 8601 format
  endDate: "2025-06-03T00:00:00.000Z",
});
```

**Read All (GET)**

```typescript
const { data: conferences, isLoading } =
  useConferenceConferenceControllerFindAll(undefined, undefined);
```

**Read One (GET)**

```typescript
const { data: conference } = useConferenceConferenceControllerFindOne(
  [1],
  undefined
);
```

**Update (PATCH)**

```typescript
const updateConference = useConferenceConferenceControllerUpdate();
updateConference.mutate([1, { location: "Munich" }]);
// Note: Pass [id, requestBody] as array for methods with multiple parameters
```

**Delete (DELETE)**

```typescript
const deleteConference = useConferenceConferenceControllerRemove();
deleteConference.mutate(1);
// Note: Pass id directly, not as object
```

---

## 3. Presentation CRUD Operations

### Import

```typescript
import {
  usePresentationPresentationControllerCreate,
  usePresentationPresentationControllerFindAll,
  usePresentationPresentationControllerFindOne,
  usePresentationPresentationControllerUpdate,
  usePresentationPresentationControllerRemove,
} from "./api/generate/hooks/PresentationService.hooks";
```

### Usage Examples

**Create (POST)**

```typescript
const createPresentation = usePresentationPresentationControllerCreate();
createPresentation.mutate({
  title: "AI in Modern Web Development",
  agendaPosition: 1,
  conferenceId: 1,
  userId: 1,
});
```

**Read All (GET)**

```typescript
const { data: presentations } = usePresentationPresentationControllerFindAll(
  undefined,
  undefined
);
```

**Read One (GET)**

```typescript
const { data: presentation } = usePresentationPresentationControllerFindOne(
  [1],
  undefined
);
```

**Update (PATCH)**

```typescript
const updatePresentation = usePresentationPresentationControllerUpdate();
updatePresentation.mutate([1, { title: "Updated Title" }]);
```

**Delete (DELETE)**

```typescript
const deletePresentation = usePresentationPresentationControllerRemove();
deletePresentation.mutate(1);
```

---

## 4. Rating CRUD Operations

### Import

```typescript
import {
  useRatingRatingControllerCreate,
  useRatingRatingControllerFindAll,
  useRatingRatingControllerFindOne,
  useRatingRatingControllerUpdate,
  useRatingRatingControllerRemove,
} from "./api/generate/hooks/RatingService.hooks";
```

### Usage Examples

**Create (POST)**

```typescript
const createRating = useRatingRatingControllerCreate();
createRating.mutate({
  rating: 9,
  userId: 1,
  presentationId: 1,
});
```

**Read All (GET)**

```typescript
const { data: ratings } = useRatingRatingControllerFindAll(
  undefined,
  undefined
);
```

**Read One (GET)**

```typescript
const { data: rating } = useRatingRatingControllerFindOne([1], undefined);
```

**Update (PATCH)**

```typescript
const updateRating = useRatingRatingControllerUpdate();
updateRating.mutate([1, { rating: 10 }]);
```

**Delete (DELETE)**

```typescript
const deleteRating = useRatingRatingControllerRemove();
deleteRating.mutate(1);
```

---

## 5. User CRUD Operations

### Import

```typescript
import {
  useUserUserControllerCreate,
  useUserUserControllerFindAll,
  useUserUserControllerFindOne,
  useUserUserControllerUpdate,
  useUserUserControllerRemove,
} from "./api/generate/hooks/UserService.hooks";
```

### Usage Examples

**Create (POST)**

```typescript
const createUser = useUserUserControllerCreate();
createUser.mutate({
  email: "user@example.com",
  code: "ABC123",
  conferenceId: 1,
});
```

**Read All (GET)**

```typescript
const { data: users } = useUserUserControllerFindAll(undefined, undefined);
```

**Read One (GET)**

```typescript
const { data: user } = useUserUserControllerFindOne([1], undefined);
```

**Update (PATCH)**

```typescript
const updateUser = useUserUserControllerUpdate();
updateUser.mutate([1, { email: "newemail@example.com" }]);
```

**Delete (DELETE)**

```typescript
const deleteUser = useUserUserControllerRemove();
deleteUser.mutate(1);
```

---

## Hook Patterns

### Query Hooks (GET requests)

All query hooks return React Query's `useQuery` result:

```typescript
const {
  data,          // The response data
  isLoading,     // Loading state
  error,         // Error object if request failed
  refetch,       // Function to manually refetch
  isSuccess      // Success state
} = useResourceFindAll(args?, options?);
```

### Mutation Hooks (POST/PUT/PATCH/DELETE)

All mutation hooks return React Query's `useMutation` result:

```typescript
const mutation = useResourceCreate(options?);

// Single parameter (e.g., create, login)
mutation.mutate({ name: "value", ... }, {
  onSuccess: (data) => console.log('Success!', data),
  onError: (error) => console.error('Error!', error)
});

// Multiple parameters (e.g., update with id + body)
mutation.mutate([id, { field: "value" }], {
  onSuccess: (data) => console.log('Success!', data),
});

// Single value (e.g., delete with just id)
mutation.mutate(1, {
  onSuccess: () => console.log('Deleted!'),
});

// Check state
mutation.isPending  // Loading state
mutation.isSuccess  // Success state
mutation.error      // Error object
```

**Important Parameter Patterns:**

- **Create/Login**: Pass single object → `mutate({ field: value })`
- **Update**: Pass array → `mutate([id, { field: value }])`
- **Delete**: Pass id directly → `mutate(id)`
- **FindOne**: Pass array → `([id], options)`

---

## Auto-Invalidation

✅ **All mutations automatically invalidate the corresponding `findAll` query**

When you create, update, or delete a resource, the list automatically refreshes:

```typescript
// After this mutation completes...
deleteConference.mutate({ id: 1 });

// ...this query automatically refetches
const { data: conferences } = useConferenceConferenceControllerFindAll(
  undefined,
  undefined
);
```

---

## Regenerating Hooks

After any backend API changes:

```bash
cd frontend
npm run openapi:gen
```

This will:

1. Fetch the latest OpenAPI spec from `http://localhost:3000/api-json`
2. Generate TypeScript service files
3. Auto-generate React Query hooks with correct HTTP methods
4. Preserve your `OpenAPI.ts` configuration (BASE URL, credentials)

---

## Configuration

**Base URL:** `http://localhost:3000` (set in `src/api/generate/core/OpenAPI.ts`)
**Credentials:** Enabled for cookie-based authentication
**Query Client:** Configured in `src/api/queryClient.ts`

---

## Verification Status

✅ All 5 resources have complete CRUD hooks
✅ HTTP methods correctly detected (GET vs POST/PATCH/DELETE)
✅ Query hooks use `(args?, options?)` signature
✅ Mutation hooks use `(options?)` signature
✅ Auto-invalidation configured
✅ OpenAPI base URL configured
✅ Credentials enabled for auth
✅ No TypeScript errors in App.tsx
✅ React Query provider setup in main.tsx

**Your implementation is production-ready!** 🎉
