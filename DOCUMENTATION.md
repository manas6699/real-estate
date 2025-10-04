# 📘 Project Documentation

*Analysis performed on 147 files in 'src/app' and 'src/components'*

---

## 📄 `src\app\admin\BulkUpload\page.tsx`

### External Dependencies (npm packages):
- None
 
### Local Components & Utilities:
- `components\AdminComponents\Navbar.tsx`
- `components\AdminComponents\Sidebar.tsx`
- `components\AdminComponents\csvUpload.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\admin\Campaign\page.tsx`

### External Dependencies (npm packages):
- `axios`
- `react-toastify`
- `react`
- `react-select`

### Local Components & Utilities:
- `components\AdminComponents\Navbar.tsx`
- `components\AdminComponents\Sidebar.tsx`
- `components\loader.tsx`

### 🔗 API Calls Detected:
- `axios.get → [Config Constant] GET_ALL_TELECALLERS_API`
- `axios.post → [Config Constant] CREATE_CAMPAIGN`

---

## 📄 `src\app\admin\Dashboard\assigned\page.tsx`

### External Dependencies (npm packages):
- `axios`
- `react`

### Local Components & Utilities:
- `components\AdminComponents\Navbar.tsx`
- `components\AdminComponents\Sidebar.tsx`
- `components\AdminComponents\ModifiedAssignedTable.tsx`

### 🔗 API Calls Detected:
- `axios.get → [Config Constant] SHOW_ALL_ASSIGNS_API`

---

## 📄 `src\app\admin\Dashboard\ManageLeads\page.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- `components\AdminComponents\Navbar.tsx`
- `components\AdminComponents\Sidebar.tsx`
- `components\AdminComponents\LeadTable.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\admin\Dashboard\overdue\page.tsx`

### External Dependencies (npm packages):
- `axios`
- `react`
- `lucide-react`

### Local Components & Utilities:
- `components\AdminComponents\Navbar.tsx`
- `components\AdminComponents\Sidebar.tsx`
- `components\AdminComponents\ModifiedAssignedTable.tsx`

### 🔗 API Calls Detected:
- `axios.get → [Config Constant] GET_ALL_SCHEDULES`
- `axios.post → [Config Constant] GET_MULTIPLE_ASSIGNS`

---

## 📄 `src\app\admin\Dashboard\page.tsx`

### External Dependencies (npm packages):
- `jwt-decode`
- `next/navigation`
- `react`

### Local Components & Utilities:
- `components\AdminComponents\Navbar.tsx`
- `components\AdminComponents\Sidebar.tsx`
- `components\AdminComponents\Overview.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\admin\Dashboard\Report\old\page.tsx`

### External Dependencies (npm packages):
- `react`
- `@tanstack/react-table`
- `lucide-react`

### Local Components & Utilities:
- `components\AdminComponents\Navbar.tsx`
- `components\AdminComponents\Sidebar.tsx`
- `options\Locations.ts`

### 🔗 API Calls Detected:
- `fetch → [Config Constant] GET_ALL_TELECALLERS_API`
- `fetch → [Config Constant] ASSIGN_OLD_LEADS_TO_TELECALLER`
- `fetch → Template String (Dynamic URL)`

---

## 📄 `src\app\admin\Dashboard\Report\page.tsx`

### External Dependencies (npm packages):
- `react`
- `axios`
- `xlsx`

### Local Components & Utilities:
- `components\AdminComponents\Navbar.tsx`
- `components\AdminComponents\Sidebar.tsx`
- `types\AssignType.ts`
- `components\AdminComponents\ReportTable.tsx`
- `options\Leadstatus.ts`
- `options\PreferedConfig.ts`

### 🔗 API Calls Detected:
- `axios.get → [Config Constant] GET_ALL_TELECALLERS_API`
- `axios.get → [Config Constant] GET_ALL_LOCATIONS`
- `axios.get → [Config Constant] GET_ALL_PROJECTS`
- `axios.get → [Config Constant] SHOW_ALL_ASSIGNS_API`
- `axios.get → [Config Constant] GET_FILTERED_DATA`

---

## 📄 `src\app\admin\InsertLead\page.tsx`

### External Dependencies (npm packages):
- `axios`
- `react`
- `react-toastify`

### Local Components & Utilities:
- `components\loader.tsx`
- `components\AdminComponents\Navbar.tsx`
- `components\AdminComponents\Sidebar.tsx`
- `components\AdminComponents\AddProject.tsx`
- `components\AdminComponents\AddLocation.tsx`

### 🔗 API Calls Detected:
- `axios.get → [Config Constant] GET_ALL_PROJECTS`
- `axios.get → [Config Constant] GET_ALL_SOURCES`
- `axios.post → [Config Constant] POST_A_SOURCE`
- `axios.post → [Config Constant] LEADS_ENDPOINT`
- `axios.isAxiosError → [Identifier] error (Likely Dynamic/Local Var)`

---

## 📄 `src\app\admin\LeadData\page.tsx`

### External Dependencies (npm packages):
- None

### Local Components & Utilities:
- `components\Footer.tsx`
- `components\LeadTable.tsx`
- `components\LeadCards.tsx`
- `components\MondrianButton.tsx`
- `components\AdminComponents\Navbar.tsx`
- `app\hooks\useAuthRedirect.ts`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\admin\ManagePages\page.tsx`

### External Dependencies (npm packages):
- `axios`
- `zod`
- `next/image`
- `react`
- `@hookform/resolvers/zod`
- `react-hook-form`
- `react-toastify`
- `react-toastify/dist/ReactToastify.css`

### Local Components & Utilities:
- `components\loader.tsx`
- `components\AdminComponents\Navbar.tsx`

### 🔗 API Calls Detected:
- `axios.post → Template String (Dynamic URL)`

---

## 📄 `src\app\admin\ManageUser\page.tsx`

### External Dependencies (npm packages):
- `react`
- `axios`

### Local Components & Utilities:
- `components\AdminComponents\Navbar.tsx`
- `components\AdminComponents\Sidebar.tsx`
- `components\AdminComponents\UsersTable.tsx`

### 🔗 API Calls Detected:
- `axios.get → [Config Constant] SHOW_ALL_USERS_API`

---

## 📄 `src\app\data\developers.ts`

### External Dependencies (npm packages):
- None

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\developers\[slug]\page.tsx`

### External Dependencies (npm packages):
- `next/image`
- `next/navigation`

### Local Components & Utilities:
- `app\data\developers.ts`
- `components\EnquireBtn.tsx`
- `components\Footer.tsx`
- `components\Home\Navbar.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\DevepoperPage\page.tsx`

### External Dependencies (npm packages):
- `next/link`
- `next/image`

### Local Components & Utilities:
- `components\Footer.tsx`
- `components\Navbar.tsx`
- `app\data\developers.ts`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\emami-aamod\layout.tsx`

### External Dependencies (npm packages):
- `next/script`
- `next/font/google`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\emami-aamod\page.js`

### External Dependencies (npm packages):
- None

### Local Components & Utilities:
- `components\Form.tsx`
- `components\Footer.tsx`
- `components\Navbar.tsx`
- `components\emami\Info.tsx`
- `components\emami\Hero.tsx`
- `components\emami\About.tsx`
- `components\Amenities.tsx`
- `components\PopupForm.tsx`
- `components\emami\Overview.tsx`
- `components\emami\MapView.tsx`
- `components\emami\FloorPlans.tsx`
- `components\emami\MagicCard.tsx`
- `components\emami\PaymentPlan.tsx`
- `components\emami\GalleryEmami.tsx`
- `components\StickyButtonsRight.tsx`
- `components\emami\DownloadBrochure.tsx`
- `components\MobileMagicHiddenForm.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\GodrejBlue\layout.tsx`

### External Dependencies (npm packages):
- `next/script`
- `next/font/google`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\GodrejBlue\page.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- `components\Form.tsx`
- `components\Footer.tsx`
- `components\Navbar.tsx`
- `components\Amenities.tsx`
- `components\GodrejBlue\Info.tsx`
- `components\GodrejBlue\Map.tsx`
- `components\GodrejBlue\Hero.tsx`
- `components\PopupForm.tsx`
- `components\ImageGallery.tsx`
- `components\GodrejBlue\Overview.tsx`
- `components\GodrejBlue\MagicCard.tsx`
- `components\Home\EmiCalculator.tsx`
- `components\StickyButtonsRight.tsx`
- `components\GodrejBlue\PaymentPlan.tsx`
- `components\MobileMagicHiddenForm.tsx`
- `components\GodrejBlue\DownloadBrochure.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\hooks\useAuthRedirect.ts`

### External Dependencies (npm packages):
- `react`
- `next/navigation`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\hooks\useRoleRedirect.ts`

### External Dependencies (npm packages):
- `react`
- `next/navigation`
- `jwt-decode`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\hooks\useSocket.ts`

### External Dependencies (npm packages):
- `react`
- `socket.io-client`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\hooks\useSubmit.ts`

### External Dependencies (npm packages):
- `axios`
- `react-toastify`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- `axios.post → [Config Constant] LEADS_ENDPOINT`
- `axios.isAxiosError → [Identifier] error (Likely Dynamic/Local Var)`

---

## 📄 `src\app\layout.tsx`

### External Dependencies (npm packages):
- `next`
- `next/font/google`
- `next/script`
- `@next/third-parties/google`

### Local Components & Utilities:
- `app\globals.css`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\login\page.tsx`

### External Dependencies (npm packages):
- `axios`
- `react`

### Local Components & Utilities:
- `components\loader.tsx`
- `app\hooks\useRoleRedirect.ts`

### 🔗 API Calls Detected:
- `axios.post → Template String (Dynamic URL)`
- `axios.isAxiosError → [Identifier] err (Likely Dynamic/Local Var)`

---

## 📄 `src\app\morya\layout.tsx`

### External Dependencies (npm packages):
- `next/script`
- `next/font/google`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\morya\page.js`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- `components\Form.tsx`
- `components\Footer.tsx`
- `components\Navbar.tsx`
- `components\Amenities.tsx`
- `components\PopupForm.tsx`
- `components\componentsMorya\Info.tsx`
- `components\componentsMorya\Hero.tsx`
- `components\componentsMorya\About.tsx`
- `components\componentsMorya\MapView.tsx`
- `components\Home\EmiCalculator.tsx`
- `components\componentsMorya\Overview.tsx`
- `components\componentsMorya\FloorPlans.tsx`
- `components\componentsMorya\MagicCard.tsx`
- `components\StickyButtonsRight.tsx`
- `components\componentsMorya\PaymentPlan.tsx`
- `components\componentsMorya\GalleryMorya.tsx`
- `components\MobileMagicHiddenForm.tsx`
- `components\componentsMorya\DownloadBrochure.tsx`
- `components\componentsMorya\FloorPlansDownload.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\page.tsx`

### External Dependencies (npm packages):
- None

### Local Components & Utilities:
- `components\Footer.tsx`
- `components\Home\Hero.tsx`
- `components\Home\Team.tsx`
- `components\Home\Explore.tsx`
- `components\Home\Navbar.tsx`
- `components\Home\Developer.tsx`
- `components\Home\ChooseUs.tsx`
- `components\Home\StatsSection.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\privacypolicy\page.tsx`

### External Dependencies (npm packages):
- `next/head`

### Local Components & Utilities:
- `components\Footer.tsx`
- `components\Home\Navbar.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\properties\[slug]\page.tsx`

### External Dependencies (npm packages):
- None

### Local Components & Utilities:
- `dynamicComponents\AllinOne.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\refund\page.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- `components\Footer.tsx`
- `components\Navbar.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\RoyalGanges\layout.tsx`

### External Dependencies (npm packages):
- `next/script`
- `next/font/google`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\RoyalGanges\page.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- `components\Form.tsx`
- `components\Footer.tsx`
- `components\Navbar.tsx`
- `components\Amenities.tsx`
- `components\RoyalGanges\Info.tsx`
- `components\RoyalGanges\Map.tsx`
- `components\PopupForm.tsx`
- `components\RoyalGanges\Hero.tsx`
- `components\RoyalGanges\About.tsx`
- `components\RoyalGanges\Gallery.tsx`
- `components\RoyalGanges\Overview.tsx`
- `components\RoyalGanges\FloorPlans.tsx`
- `components\RoyalGanges\MagicCard.tsx`
- `components\Home\EmiCalculator.tsx`
- `components\StickyButtonsRight.tsx`
- `components\RoyalGanges\PaymentPlan.tsx`
- `components\MobileMagicHiddenForm.tsx`
- `components\RoyalGanges\DownloadBrochure.tsx`
- `components\componentsMorya\FloorPlansDownload.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\supervisor\BulkAssign\page.tsx`

### External Dependencies (npm packages):
- None

### Local Components & Utilities:
- `components\AdminComponents\Navbar.tsx`
- `components\SupervisorComponents\Sidebar.tsx`
- `components\AdminComponents\LeadTable.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\supervisor\BulkUpload\page.tsx`

### External Dependencies (npm packages):
- None

### Local Components & Utilities:
- `components\AdminComponents\Navbar.tsx`
- `components\SupervisorComponents\Sidebar.tsx`
- `components\SupervisorComponents\CsvUpload.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\supervisor\Dashboard\page.tsx`

### External Dependencies (npm packages):
- `jwt-decode`
- `next/navigation`
- `react`

### Local Components & Utilities:
- `components\AdminComponents\Navbar.tsx`
- `components\AdminComponents\Overview.tsx`
- `components\SupervisorComponents\Sidebar.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\supervisor\InsertLead\page.tsx`

### External Dependencies (npm packages):
- `axios`
- `react`
- `react-toastify`

### Local Components & Utilities:
- `components\loader.tsx`
- `components\AdminComponents\Navbar.tsx`
- `components\SupervisorComponents\Sidebar.tsx`
- `components\AdminComponents\AddProject.tsx`
- `components\AdminComponents\AddLocation.tsx`

### 🔗 API Calls Detected:
- `axios.get → [Config Constant] GET_ALL_PROJECTS`
- `axios.get → [Config Constant] GET_ALL_SOURCES`
- `axios.post → [Config Constant] POST_A_SOURCE`
- `axios.post → [Config Constant] LEADS_ENDPOINT`
- `axios.isAxiosError → [Identifier] error (Likely Dynamic/Local Var)`

---

## 📄 `src\app\supervisor\Report\page.tsx`

### External Dependencies (npm packages):
- `react`
- `axios`
- `xlsx`

### Local Components & Utilities:
- `components\AdminComponents\Navbar.tsx`
- `components\SupervisorComponents\Sidebar.tsx`
- `types\AssignType.ts`
- `components\AdminComponents\ReportTable.tsx`
- `options\Leadstatus.ts`
- `options\PreferedConfig.ts`

### 🔗 API Calls Detected:
- `axios.get → [Config Constant] GET_ALL_TELECALLERS_API`
- `axios.get → [Config Constant] GET_ALL_LOCATIONS`
- `axios.get → [Config Constant] GET_ALL_PROJECTS`
- `axios.get → [Config Constant] SHOW_ALL_ASSIGNS_API`
- `axios.get → [Config Constant] GET_FILTERED_DATA`

---

## 📄 `src\app\telecaller\Calender\page.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- `components\AdminComponents\Navbar.tsx`
- `components\TelecallerComponents\TelecallerSidebar.tsx`
- `components\TelecallerComponents\Calender.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\telecaller\change\[slug]\page.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- `components\AdminComponents\Navbar.tsx`
- `components\TelecallerComponents\FixCard.tsx`
- `components\TelecallerComponents\LeadEditForm.tsx`
- `components\TelecallerComponents\TelecallerSidebar.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\telecaller\Dashboard\page.tsx`

### External Dependencies (npm packages):
- `axios`
- `react`
- `jwt-decode`
- `react-toastify`
- `react-toastify/dist/ReactToastify.css`
- `socket.io-client`

### Local Components & Utilities:
- `components\AdminComponents\Navbar.tsx`
- `options\Leadstatus.ts`
- `options\PreferedConfig.ts`
- `components\TelecallerComponents\TelecallerSidebar.tsx`
- `components\TelecallerComponents\AssignedLeads.tsx`
- `components\TelecallerComponents\TelecallerOverView.tsx`

### 🔗 API Calls Detected:
- `axios.get → [Config Constant] GET_ALL_LOCATIONS`
- `axios.get → [Config Constant] GET_ALL_PROJECTS`

---

## 📄 `src\app\telecaller\lead\[slug]\page.tsx`

### External Dependencies (npm packages):
- `axios`
- `react`
- `next/navigation`
- `react-toastify/dist/ReactToastify.css`

### Local Components & Utilities:
- `components\AdminComponents\Navbar.tsx`
- `components\TelecallerComponents\TelecallerSidebar.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\telecaller\OldReport\page.tsx`

### External Dependencies (npm packages):
- `react`
- `@tanstack/react-table`
- `axios`

### Local Components & Utilities:
- `components\AdminComponents\Navbar.tsx`
- `components\TelecallerComponents\TelecallerSidebar.tsx`
- `utils\dateformat.ts`
- `options\Locations.ts`
- `options\Leadstatus.ts`

### 🔗 API Calls Detected:
- `axios.get → [Config Constant] GET_OLD_LEADS_FOR_TELECALLER`
- `axios.get → [Config Constant] GET_ALL_TELECALLERS_API`
- `fetch → [Config Constant] ASSIGN_OLD_LEADS_TO_TELECALLER`

---

## 📄 `src\app\telecaller\processed\page.tsx`

### External Dependencies (npm packages):
- `axios`
- `react`
- `react-toastify`
- `react-toastify/dist/ReactToastify.css`
- `socket.io-client`

### Local Components & Utilities:
- `components\AdminComponents\Navbar.tsx`
- `components\TelecallerComponents\TelecallerSidebar.tsx`
- `components\TelecallerComponents\AssignedLeads.tsx`

### 🔗 API Calls Detected:
- `axios.get → Template String (Dynamic URL)`

---

## 📄 `src\app\terms\page.tsx`

### External Dependencies (npm packages):
- None

### Local Components & Utilities:
- `components\Footer.tsx`
- `components\Home\Navbar.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\town-square\layout.tsx`

### External Dependencies (npm packages):
- `next/script`
- `next/font/google`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\app\town-square\page.tsx`

### External Dependencies (npm packages):
- None

### Local Components & Utilities:
- `components\Form.tsx`
- `components\Footer.tsx`
- `components\Navbar.tsx`
- `components\town-square\About.tsx`
- `components\town-square\Gallery.tsx`
- `components\town-square\Overview.tsx`
- `components\town-square\MapView.tsx`
- `components\Amenities.tsx`
- `components\town-square\Highlights.tsx`
- `components\town-square\FloorPlans.tsx`
- `components\town-square\MagicCard.tsx`
- `components\town-square\Herosection.tsx`
- `components\town-square\PaymentPlan.tsx`
- `components\MobileMagicHiddenForm.tsx`
- `components\town-square\PropertyInfoSection.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\AdminComponents\Activity.tsx`

### External Dependencies (npm packages):
- `lucide-react`
- `react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\AdminComponents\AddLocation.tsx`

### External Dependencies (npm packages):
- `react`
- `axios`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- `axios.post → [Config Constant] POST_A_LOCATION`

---

## 📄 `src\components\AdminComponents\AddProject.tsx`

### External Dependencies (npm packages):
- `react`
- `axios`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- `axios.post → [Config Constant] POST_A_PROJECT`

---

## 📄 `src\components\AdminComponents\AssignedTable.tsx`

### External Dependencies (npm packages):
- `react`
- `@tanstack/react-table`

### Local Components & Utilities:
- `components\AdminComponents\ReassignModal.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\AdminComponents\AssignModal.tsx`

### External Dependencies (npm packages):
- `axios`
- `react`

### Local Components & Utilities:
- `utils\sortTelecallerList.ts`

### 🔗 API Calls Detected:
- `axios.get → [Identifier] apiUrl (Likely Dynamic/Local Var)`
- `axios.post → [Config Constant] ASSIGN_API`

---

## 📄 `src\components\AdminComponents\csvUpload.tsx`

### External Dependencies (npm packages):
- `axios`
- `papaparse`
- `react-toastify/dist/ReactToastify.css`
- `react`
- `react-toastify`
- `lucide-react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- `axios.post → [Config Constant] BULK_UPLOAD_AND_ASSIGN`
- `axios.post → [Config Constant] BULK_UPLOAD_API`
- `axios.get → [Config Constant] GET_ALL_TELECALLERS_API`

---

## 📄 `src\components\AdminComponents\LeadTable.tsx`

### External Dependencies (npm packages):
- `axios`
- `react`
- `lucide-react`
- `@tanstack/react-table`

### Local Components & Utilities:
- `components\AdminComponents\AssignModal.tsx`
- `components\Blank\UnassignLeadsBlank.tsx`

### 🔗 API Calls Detected:
- `axios.get → [Config Constant] GET_ALL_UNASSIGNED_LEADS`
- `axios.get → [Config Constant] GET_ALL_TELECALLERS_API`
- `axios.post → [Config Constant] BULK_ASSIGN_API`

---

## 📄 `src\components\AdminComponents\ModifiedAssignedTable.tsx`

### External Dependencies (npm packages):
- `react`
- `@tanstack/react-table`

### Local Components & Utilities:
- `components\AdminComponents\ReassignModal.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\AdminComponents\Navbar.tsx`

### External Dependencies (npm packages):
- `react`
- `lucide-react`
- `next/navigation`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\AdminComponents\Overview.tsx`

### External Dependencies (npm packages):
- `react`
- `axios`
- `lucide-react`

### Local Components & Utilities:
- `components\AdminComponents\ScheduleTracker.tsx`
- `components\AdminComponents\ModifiedAssignedTable.tsx`

### 🔗 API Calls Detected:
- `axios.get → [Config Constant] ALL_LEAD_COUNT`
- `axios.get → [Identifier] url (Likely Dynamic/Local Var)`
- `axios.get → [Identifier] url (Likely Dynamic/Local Var)`

---

## 📄 `src\components\AdminComponents\ReassignModal.tsx`

### External Dependencies (npm packages):
- `react`
- `axios`

### Local Components & Utilities:
- `utils\sortTelecallerList.ts`

### 🔗 API Calls Detected:
- `axios.get → [Identifier] apiUrl (Likely Dynamic/Local Var)`
- `axios.post → [Config Constant] REASSIGN_API`

---

## 📄 `src\components\AdminComponents\ReportTable.tsx`

### External Dependencies (npm packages):
- `react`
- `@tanstack/react-table`
- `lucide-react`

### Local Components & Utilities:
- `types\AssignType.ts`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\AdminComponents\ScheduleTracker.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- `fetch → [Config Constant] GET_ALL_SCHEDULES`

---

## 📄 `src\components\AdminComponents\Sidebar.tsx`

### External Dependencies (npm packages):
- `react`
- `next/navigation`
- `lucide-react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\AdminComponents\UserList.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\AdminComponents\UsersTable.tsx`

### External Dependencies (npm packages):
- `react`
- `@tanstack/react-table`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\Amenities.tsx`

### External Dependencies (npm packages):
- `react`
- `next/image`
- `react-swipeable`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\Blank\UnassignLeadsBlank.tsx`

### External Dependencies (npm packages):
- `lucide-react`
- `react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\componentsMorya\About.tsx`

### External Dependencies (npm packages):
- `react`
- `next/image`

### Local Components & Utilities:
- `..\public\assets\morya\Poster.png`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\componentsMorya\Amenities.tsx`

### External Dependencies (npm packages):
- `lucide-react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\componentsMorya\DownloadBrochure.tsx`

### External Dependencies (npm packages):
- `react`
- `axios`
- `react-toastify`
- `react-toastify/dist/ReactToastify.css`
- `lucide-react`
- `next/image`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- `axios.post → [Config Constant] LEADS_ENDPOINT`
- `axios.isAxiosError → [Identifier] error (Likely Dynamic/Local Var)`

---

## 📄 `src\components\componentsMorya\FloorPlans.tsx`

### External Dependencies (npm packages):
- None

### Local Components & Utilities:
- `components\ImageGallery.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\componentsMorya\FloorPlansDownload.tsx`

### External Dependencies (npm packages):
- `react`
- `lucide-react`
- `axios`
- `react-toastify`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- `axios.post → [Config Constant] LEADS_ENDPOINT`
- `axios.isAxiosError → [Identifier] error (Likely Dynamic/Local Var)`

---

## 📄 `src\components\componentsMorya\GalleryMorya.tsx`

### External Dependencies (npm packages):
- None

### Local Components & Utilities:
- `components\ImageGallery.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\componentsMorya\Hero.tsx`

### External Dependencies (npm packages):
- `react`
- `lucide-react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\componentsMorya\Info.tsx`

### External Dependencies (npm packages):
- `lucide-react`

### Local Components & Utilities:
- `components\EnquireBtn.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\componentsMorya\MagicCard.tsx`

### External Dependencies (npm packages):
- `lucide-react`
- `react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\componentsMorya\MapView.tsx`

### External Dependencies (npm packages):
- `lucide-react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\componentsMorya\Overview.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\componentsMorya\PaymentPlan.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- `components\EnquireBtn.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\DownloadBrochureBtn.tsx`

### External Dependencies (npm packages):
- `react`
- `axios`
- `react-toastify`
- `react-toastify/dist/ReactToastify.css`
- `lucide-react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- `axios.post → https://split-wise-clone-085p.onrender.com/api/mmr/leads`
- `axios.isAxiosError → [Identifier] error (Likely Dynamic/Local Var)`

---

## 📄 `src\components\DownloadBrochureButton2.tsx`

### External Dependencies (npm packages):
- `react`
- `axios`
- `react-toastify`
- `react-toastify/dist/ReactToastify.css`
- `lucide-react`

### Local Components & Utilities:
- `components\loader.tsx`

### 🔗 API Calls Detected:
- `axios.post → https://split-wise-clone-085p.onrender.com/api/mmr/leads`
- `axios.isAxiosError → [Identifier] error (Likely Dynamic/Local Var)`

---

## 📄 `src\components\emami\About.tsx`

### External Dependencies (npm packages):
- `next/image`
- `react`

### Local Components & Utilities:
- `..\public\assets\emami\eami-logo.webp`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\emami\DownloadBrochure.tsx`

### External Dependencies (npm packages):
- `react`
- `axios`
- `react-toastify`
- `react-toastify/dist/ReactToastify.css`
- `lucide-react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- `axios.post → https://split-wise-clone-085p.onrender.com/api/mmr/leads`
- `axios.isAxiosError → [Identifier] error (Likely Dynamic/Local Var)`

---

## 📄 `src\components\emami\FloorPlans.tsx`

### External Dependencies (npm packages):
- `react`
- `lucide-react`
- `axios`
- `react-toastify`

### Local Components & Utilities:
- `components\ImageGallery.tsx`
- `components\loader.tsx`

### 🔗 API Calls Detected:
- `axios.post → https://split-wise-clone-085p.onrender.com/api/mmr/leads`
- `axios.isAxiosError → [Identifier] error (Likely Dynamic/Local Var)`

---

## 📄 `src\components\emami\GalleryEmami.tsx`

### External Dependencies (npm packages):
- None

### Local Components & Utilities:
- `components\ImageGallery.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\emami\Hero.tsx`

### External Dependencies (npm packages):
- `next/image`
- `react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\emami\Info.tsx`

### External Dependencies (npm packages):
- `axios`
- `react`
- `react-toastify`
- `lucide-react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- `axios.post → [Config Constant] LEADS_ENDPOINT`
- `axios.isAxiosError → [Identifier] error (Likely Dynamic/Local Var)`

---

## 📄 `src\components\emami\MagicCard.tsx`

### External Dependencies (npm packages):
- `lucide-react`
- `react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\emami\MapView.tsx`

### External Dependencies (npm packages):
- `react`
- `lucide-react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\emami\Overview.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\emami\PaymentPlan.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- `components\EnquireBtn.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\EnquireBtn.tsx`

### External Dependencies (npm packages):
- `axios`
- `lucide-react`
- `react`
- `react-toastify`

### Local Components & Utilities:
- `components\loader.tsx`

### 🔗 API Calls Detected:
- `axios.post → [Config Constant] LEADS_ENDPOINT`
- `axios.isAxiosError → [Identifier] error (Likely Dynamic/Local Var)`

---

## 📄 `src\components\Footer.tsx`

### External Dependencies (npm packages):
- `lucide-react`
- `next/image`
- `next/link`

### Local Components & Utilities:
- `..\public\assets\logo-transparent.png`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\Form.tsx`

### External Dependencies (npm packages):
- `axios`
- `react-toastify`
- `react`
- `lucide-react`
- `next/image`

### Local Components & Utilities:
- `components\loader.tsx`
- `..\public\assets\logo-transparent.png`

### 🔗 API Calls Detected:
- `axios.post → [Config Constant] LEADS_ENDPOINT`
- `axios.isAxiosError → [Identifier] error (Likely Dynamic/Local Var)`

---

## 📄 `src\components\GodrejBlue\DownloadBrochure.tsx`

### External Dependencies (npm packages):
- `react`
- `axios`
- `react-toastify`
- `react-toastify/dist/ReactToastify.css`
- `lucide-react`
- `next/image`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- `axios.post → [Config Constant] LEADS_ENDPOINT`
- `axios.isAxiosError → [Identifier] error (Likely Dynamic/Local Var)`

---

## 📄 `src\components\GodrejBlue\Hero.tsx`

### External Dependencies (npm packages):
- `react`
- `lucide-react`
- `lucide-react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\GodrejBlue\Info.tsx`

### External Dependencies (npm packages):
- `lucide-react`

### Local Components & Utilities:
- `components\EnquireBtn.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\GodrejBlue\MagicCard.tsx`

### External Dependencies (npm packages):
- `lucide-react`
- `react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\GodrejBlue\Map.tsx`

### External Dependencies (npm packages):
- `lucide-react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\GodrejBlue\Overview.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\GodrejBlue\PaymentPlan.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- `components\EnquireBtn.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\Home\ChooseUs.tsx`

### External Dependencies (npm packages):
- `next/image`
- `lucide-react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\Home\Developer.tsx`

### External Dependencies (npm packages):
- `next/image`
- `next/link`

### Local Components & Utilities:
- `app\data\developers.ts`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\Home\EmiCalculator.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\Home\Explore.tsx`

### External Dependencies (npm packages):
- `react`
- `next/image`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\Home\Hero.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\Home\Navbar.tsx`

### External Dependencies (npm packages):
- `axios`
- `next/link`
- `lucide-react`
- `react`
- `next/image`
- `react-toastify/dist/ReactToastify.css`
- `lucide-react`
- `react-toastify`

### Local Components & Utilities:
- `components\loader.tsx`
- `..\public\assets\logo-transparent.png`

### 🔗 API Calls Detected:
- `axios.post → [Config Constant] LEADS_ENDPOINT`
- `axios.isAxiosError → [Identifier] error (Likely Dynamic/Local Var)`

---

## 📄 `src\components\Home\RecentProperties.tsx`

### External Dependencies (npm packages):
- `react`
- `lucide-react`
- `swiper/react`
- `swiper/css`
- `swiper/css/pagination`
- `swiper/modules`
- `next/image`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\Home\StatsSection.tsx`

### External Dependencies (npm packages):
- None

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\Home\Team.tsx`

### External Dependencies (npm packages):
- `next/image`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\ImageGallery.tsx`

### External Dependencies (npm packages):
- `react`
- `next/image`
- `react-swipeable`
- `lucide-react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\LeadCards.tsx`

### External Dependencies (npm packages):
- `react`
- `lucide-react`
- `axios`

### Local Components & Utilities:
- `config\api.ts`

### 🔗 API Calls Detected:
- `axios.get → [Identifier] GET_ALL_LEADS (Likely Dynamic/Local Var)`

---

## 📄 `src\components\LeadTable.tsx`

### External Dependencies (npm packages):
- `react`
- `axios`
- `@tanstack/react-table`
- `xlsx`
- `file-saver`

### Local Components & Utilities:
- `components\loader.tsx`
- `config\api.ts`

### 🔗 API Calls Detected:
- `axios.get → [Identifier] GET_ALL_LEADS (Likely Dynamic/Local Var)`

---

## 📄 `src\components\loader.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\MobileMagicHiddenForm.tsx`

### External Dependencies (npm packages):
- `axios`
- `react`
- `react-toastify`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- `axios.post → Template String (Dynamic URL)`
- `axios.isAxiosError → [Identifier] error (Likely Dynamic/Local Var)`

---

## 📄 `src\components\MondrianButton.tsx`

### External Dependencies (npm packages):
- `react`
- `lucide-react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\Navbar.tsx`

### External Dependencies (npm packages):
- `axios`
- `next/link`
- `react`
- `next/image`
- `lucide-react`
- `react-toastify/dist/ReactToastify.css`
- `react-toastify`

### Local Components & Utilities:
- `components\loader.tsx`
- `..\public\assets\logo-transparent.png`

### 🔗 API Calls Detected:
- `axios.post → [Config Constant] LEADS_ENDPOINT`
- `axios.isAxiosError → [Identifier] error (Likely Dynamic/Local Var)`

---

## 📄 `src\components\PopupForm.tsx`

### External Dependencies (npm packages):
- `axios`
- `next/image`
- `lucide-react`
- `react-toastify`
- `react`

### Local Components & Utilities:
- `components\loader.tsx`

### 🔗 API Calls Detected:
- `axios.post → [Config Constant] LEADS_ENDPOINT`

---

## 📄 `src\components\RoyalGanges\About.tsx`

### External Dependencies (npm packages):
- `react`
- `next/image`

### Local Components & Utilities:
- `..\public\assets\srijan-logo.png`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\RoyalGanges\DownloadBrochure.tsx`

### External Dependencies (npm packages):
- `react`
- `axios`
- `react-toastify`
- `react-toastify/dist/ReactToastify.css`
- `lucide-react`
- `next/image`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- `axios.post → [Config Constant] LEADS_ENDPOINT`
- `axios.isAxiosError → [Identifier] error (Likely Dynamic/Local Var)`

---

## 📄 `src\components\RoyalGanges\FloorPlans.tsx`

### External Dependencies (npm packages):
- None

### Local Components & Utilities:
- `components\ImageGallery.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\RoyalGanges\Gallery.tsx`

### External Dependencies (npm packages):
- None

### Local Components & Utilities:
- `components\ImageGallery.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\RoyalGanges\Hero.tsx`

### External Dependencies (npm packages):
- `next/image`
- `react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\RoyalGanges\Info.tsx`

### External Dependencies (npm packages):
- `react`
- `lucide-react`

### Local Components & Utilities:
- `components\EnquireBtn.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\RoyalGanges\MagicCard.tsx`

### External Dependencies (npm packages):
- `lucide-react`
- `react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\RoyalGanges\Map.tsx`

### External Dependencies (npm packages):
- `lucide-react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\RoyalGanges\Overview.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\RoyalGanges\PaymentPlan.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- `components\EnquireBtn.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\StickyButtonsRight.tsx`

### External Dependencies (npm packages):
- `react`
- `lucide-react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\SupervisorComponents\CsvUpload.tsx`

### External Dependencies (npm packages):
- `axios`
- `papaparse`
- `react-toastify/dist/ReactToastify.css`
- `react`
- `react-toastify`
- `lucide-react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- `axios.post → [Config Constant] BULK_UPLOAD_AND_ASSIGN`
- `axios.post → [Config Constant] BULK_UPLOAD_API`
- `axios.get → [Config Constant] GET_ALL_TELECALLERS_API`

---

## 📄 `src\components\SupervisorComponents\Sidebar.tsx`

### External Dependencies (npm packages):
- `react`
- `lucide-react`
- `next/navigation`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\TelecallerComponents\AssignedLeads.tsx`

### External Dependencies (npm packages):
- `@tanstack/react-table`
- `next/navigation`
- `react`
- `axios`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\TelecallerComponents\BudgetInput.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\TelecallerComponents\Calender.tsx`

### External Dependencies (npm packages):
- `react-big-calendar`
- `react-big-calendar/lib/css/react-big-calendar.css`
- `react`
- `date-fns`
- `next/navigation`
- `react-big-calendar`
- `date-fns`
- `date-fns/locale/en-US`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\TelecallerComponents\FixCard.tsx`

### External Dependencies (npm packages):
- `react`
- `axios`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- `axios.get → Template String (Dynamic URL)`

---

## 📄 `src\components\TelecallerComponents\LeadEditForm.tsx`

### External Dependencies (npm packages):
- `axios`
- `react`
- `react-toastify`
- `react-toastify/dist/ReactToastify.css`

### Local Components & Utilities:
- `components\loader.tsx`
- `options\Leadstatus.ts`
- `options\PreferedConfig.ts`
- `components\TelecallerComponents\BudgetInput.tsx`

### 🔗 API Calls Detected:
- `axios.get → [Config Constant] GET_ALL_PROJECTS`
- `axios.get → [Config Constant] GET_ALL_TELECALLERS_API`
- `axios.post → [Config Constant] POST_A_PROJECT`
- `axios.post → [Config Constant] REASSIGN_NEW_LEADS`

---

## 📄 `src\components\TelecallerComponents\ScheduleTracker.tsx`

### External Dependencies (npm packages):
- `react`
- `react-toastify`
- `react-toastify/dist/ReactToastify.css`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\TelecallerComponents\TelecallerOverView.tsx`

### External Dependencies (npm packages):
- `react`
- `axios`

### Local Components & Utilities:
- `components\TelecallerComponents\ScheduleTracker.tsx`

### 🔗 API Calls Detected:
- `axios.get → [Identifier] url (Likely Dynamic/Local Var)`
- `axios.get → Template String (Dynamic URL)`
- `axios.isAxiosError → [Identifier] err (Likely Dynamic/Local Var)`

---

## 📄 `src\components\TelecallerComponents\TelecallerSidebar.tsx`

### External Dependencies (npm packages):
- `react`
- `lucide-react`
- `next/navigation`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\town-square\About.tsx`

### External Dependencies (npm packages):
- `next/image`
- `react`

### Local Components & Utilities:
- `..\public\assets\srijan-logo.png`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\town-square\FloorPlans.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- `components\ImageGallery.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\town-square\Gallery.tsx`

### External Dependencies (npm packages):
- `react`
- `lucide-react`
- `axios`
- `react-toastify`

### Local Components & Utilities:
- `components\ImageGallery.tsx`

### 🔗 API Calls Detected:
- `axios.post → https://split-wise-clone-085p.onrender.com/api/mmr/leads`
- `axios.isAxiosError → [Identifier] error (Likely Dynamic/Local Var)`

---

## 📄 `src\components\town-square\Herosection.tsx`

### External Dependencies (npm packages):
- `react`
- `lucide-react`
- `lucide-react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\town-square\Highlights.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- `components\DownloadBrochureBtn.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\town-square\MagicCard.tsx`

### External Dependencies (npm packages):
- `lucide-react`
- `react`
- `lucide-react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\town-square\MapView.tsx`

### External Dependencies (npm packages):
- `lucide-react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\town-square\Overview.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- None

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\town-square\PaymentPlan.tsx`

### External Dependencies (npm packages):
- `react`

### Local Components & Utilities:
- `components\EnquireBtn.tsx`

### 🔗 API Calls Detected:
- None

---

## 📄 `src\components\town-square\PropertyInfoSection.tsx`

### External Dependencies (npm packages):
- None

### Local Components & Utilities:
- `components\EnquireBtn.tsx`

### 🔗 API Calls Detected:
- None

---

