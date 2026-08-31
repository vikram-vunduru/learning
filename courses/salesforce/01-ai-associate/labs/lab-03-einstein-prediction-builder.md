# Lab 3: Lead Conversion Prediction with Einstein Prediction Builder

**Objective:** Use Einstein Prediction Builder to create a machine learning model that predicts which Leads are most likely to convert — without writing a single line of code.

**Time Required:** 45 minutes (plus 15-30 minutes of model training time — you can take a break during training)

**Prerequisites:**
- Completed Lab 1 (Developer Edition org with Einstein enabled)
- At least 100 Lead records in your org (you'll create them in Part 1 of this lab)

---

## Overview

Einstein Prediction Builder is a **no-code machine learning tool** built into Salesforce. It analyzes historical Salesforce data and builds a predictive model that scores each record with a likelihood percentage. In this lab, you'll predict Lead conversion — one of the most common real-world use cases for Einstein.

### How Einstein Prediction Builder Works (Conceptual Overview)

1. You define **what** you want to predict (the "outcome") — e.g., "Will this Lead be converted?"
2. You tell Einstein **where to find training examples** — historical Lead records where you know the outcome
3. Einstein analyzes patterns in the data (**training**) — it finds correlations between fields (industry, lead source, number of employees) and the outcome
4. Einstein generates **prediction scores** — a 0-100% probability for each new Lead record
5. Scores appear on Lead records as a **field**, which can trigger flows, alerts, or display on pages

---

## Part 1: Create Sample Lead Data

Einstein Prediction Builder requires a minimum of 400 records with known outcomes to train a model (in production). Developer Edition orgs have a lower threshold for testing. We'll create 100+ Lead records using Salesforce's built-in data import tool.

### Step 1: Download the Sample Lead Data File

Create the following CSV data. Open any text editor (Notepad on Windows, TextEdit on Mac) and paste the content below, saving it as `sample_leads.csv`.

> **Shortcut:** You can also create this file in Google Sheets and download as CSV.

The CSV should have these columns:
`FirstName,LastName,Company,Email,LeadSource,Industry,AnnualRevenue,NumberOfEmployees,Title,Status,IsConverted`

Copy and paste the following 120 rows of sample data into your file:

```csv
FirstName,LastName,Company,Email,LeadSource,Industry,AnnualRevenue,NumberOfEmployees,Title,Status,IsConverted
James,Anderson,TechVision Inc,james.anderson@techvision.com,Web,Technology,5000000,250,VP of Sales,Closed - Converted,true
Maria,Garcia,RetailMax,maria.garcia@retailmax.com,Trade Show,Retail,1200000,45,Owner,Closed - Not Converted,false
Robert,Johnson,FinEdge Corp,robert.johnson@finedge.com,Web,Finance,8500000,400,CTO,Closed - Converted,true
Linda,Martinez,HealthFirst,linda.martinez@healthfirst.com,Referral,Healthcare,3200000,120,Director,Closed - Converted,true
David,Wilson,BuildRight LLC,david.wilson@buildright.com,Cold Call,Construction,750000,22,Manager,Closed - Not Converted,false
Jennifer,Taylor,SoftPro Solutions,jennifer.taylor@softpro.com,Web,Technology,12000000,560,CEO,Closed - Converted,true
Michael,Brown,AgriSupply Co,michael.brown@agrisupply.com,Trade Show,Agriculture,450000,15,Owner,Closed - Not Converted,false
Sarah,Davis,MedTech Systems,sarah.davis@medtech.com,Referral,Healthcare,6700000,300,VP Engineering,Closed - Converted,true
Christopher,Miller,EduLearn Inc,christopher.miller@edulearn.com,Web,Education,2100000,85,Director,Closed - Not Converted,false
Jessica,Wilson,CloudBase Ltd,jessica.wilson@cloudbase.com,Partner,Technology,9200000,420,CTO,Closed - Converted,true
Matthew,Moore,LegalEdge,matthew.moore@legaledge.com,Web,Legal,1800000,60,Partner,Closed - Converted,true
Ashley,Taylor,FoodFresh Corp,ashley.taylor@foodfresh.com,Cold Call,Food & Beverage,650000,30,Manager,Closed - Not Converted,false
Joshua,Anderson,InsurePro,joshua.anderson@insurepro.com,Referral,Insurance,4400000,180,VP Sales,Closed - Converted,true
Amanda,Thomas,TransLogic,amanda.thomas@translogic.com,Trade Show,Transportation,2800000,130,Director,Closed - Not Converted,false
Ryan,Jackson,DataStream Analytics,ryan.jackson@datastream.com,Web,Technology,15000000,700,CEO,Closed - Converted,true
Megan,White,EnergyPulse,megan.white@energypulse.com,Referral,Energy,7600000,350,CTO,Closed - Converted,true
Kevin,Harris,RetailWorld,kevin.harris@retailworld.com,Cold Call,Retail,920000,38,Owner,Closed - Not Converted,false
Nicole,Martin,BioHealth Labs,nicole.martin@biohealth.com,Web,Healthcare,11200000,500,VP Research,Closed - Converted,true
Brandon,Garcia,SmallBiz Co,brandon.garcia@smallbiz.com,Trade Show,Other,280000,8,Owner,Closed - Not Converted,false
Stephanie,Martinez,CloudNine Tech,stephanie.martinez@cloudnine.com,Referral,Technology,6800000,310,Director,Closed - Converted,true
Tyler,Robinson,AutoDrive Corp,tyler.robinson@autodrive.com,Web,Automotive,5500000,260,VP Operations,Closed - Converted,true
Rachel,Clark,FashionHub,rachel.clark@fashionhub.com,Trade Show,Retail,380000,14,CEO,Closed - Not Converted,false
Nicholas,Rodriguez,SecureNet,nicholas.rodriguez@securenet.com,Partner,Technology,8900000,410,CISO,Closed - Converted,true
Lauren,Lewis,GreenEnergy Solutions,lauren.lewis@greenenergy.com,Web,Energy,4100000,170,Director,Closed - Converted,true
Justin,Lee,HomeCare Services,justin.lee@homecare.com,Cold Call,Healthcare,670000,25,Manager,Closed - Not Converted,false
Brittany,Walker,FinTrust Bank,brittany.walker@fintrust.com,Referral,Finance,9800000,450,VP Finance,Closed - Converted,true
Andrew,Hall,MediaStream,andrew.hall@mediastream.com,Web,Media,3600000,145,CTO,Closed - Not Converted,false
Kayla,Allen,SafeGuard Insurance,kayla.allen@safeguard.com,Partner,Insurance,5200000,240,VP Sales,Closed - Converted,true
Zachary,Young,QuickShip Logistics,zachary.young@quickship.com,Trade Show,Transportation,1400000,55,Director,Closed - Not Converted,false
Samantha,Hernandez,ProManage Software,samantha.hernandez@promanage.com,Web,Technology,7300000,340,CEO,Closed - Converted,true
Austin,King,FarmTech Inc,austin.king@farmtech.com,Cold Call,Agriculture,560000,20,Owner,Closed - Not Converted,false
Victoria,Wright,HealthPlus Medical,victoria.wright@healthplus.com,Referral,Healthcare,8200000,380,CMO,Closed - Converted,true
Cameron,Scott,TechLaunch Startup,cameron.scott@techlaunch.com,Web,Technology,1900000,72,CTO,Closed - Converted,true
Emily,Torres,LuxRetail,emily.torres@luxretail.com,Trade Show,Retail,2200000,95,Director,Closed - Not Converted,false
Dylan,Nguyen,CloudForce Systems,dylan.nguyen@cloudforce.com,Partner,Technology,13500000,620,VP Engineering,Closed - Converted,true
Kayleigh,Hill,GovServices Corp,kayleigh.hill@govservices.com,Web,Government,3000000,125,Director,Closed - Not Converted,false
Evan,Flores,PharmaGen Inc,evan.flores@pharmagen.com,Referral,Healthcare,10100000,470,VP Research,Closed - Converted,true
Hannah,Green,QuickMart Retail,hannah.green@quickmart.com,Cold Call,Retail,730000,28,Manager,Closed - Not Converted,false
Nathan,Adams,DataLogic AI,nathan.adams@datalogic.com,Web,Technology,11800000,540,CEO,Closed - Converted,true
Olivia,Nelson,BuildCo Construction,olivia.nelson@buildco.com,Trade Show,Construction,1100000,42,Owner,Closed - Not Converted,false
Connor,Baker,SecureCloud,connor.baker@securecloud.com,Partner,Technology,9500000,440,CISO,Closed - Converted,true
Alexis,Carter,InvestPro Financial,alexis.carter@investpro.com,Web,Finance,6100000,285,VP Finance,Closed - Converted,true
Caleb,Mitchell,SupplyChain Corp,caleb.mitchell@supplychain.com,Trade Show,Transportation,2500000,110,Director,Closed - Not Converted,false
Hailey,Perez,CyberDefense Inc,hailey.perez@cyberdefense.com,Referral,Technology,14200000,650,CTO,Closed - Converted,true
Jake,Roberts,RegionalBank,jake.roberts@regionalbank.com,Web,Finance,4800000,220,VP Operations,Closed - Converted,true
Brianna,Turner,TinyBiz LLC,brianna.turner@tinybiz.com,Cold Call,Other,190000,6,Owner,Closed - Not Converted,false
Logan,Phillips,MedDevice Co,logan.phillips@meddevice.com,Referral,Healthcare,7900000,365,Director,Closed - Converted,true
Abigail,Campbell,EduTech Systems,abigail.campbell@edutech.com,Web,Education,3300000,135,CTO,Closed - Not Converted,false
Jordan,Parker,CloudAnalytics,jordan.parker@cloudanalytics.com,Partner,Technology,10800000,495,CEO,Closed - Converted,true
Taylor,Evans,RetailSpace,taylor.evans@retailspace.com,Trade Show,Retail,870000,34,Manager,Closed - Not Converted,false
Hunter,Edwards,AeroTech Systems,hunter.edwards@aerotech.com,Web,Aerospace,16500000,760,VP Engineering,Closed - Converted,true
Paige,Collins,InsureNow Corp,paige.collins@insurenow.com,Referral,Insurance,5700000,265,VP Sales,Closed - Converted,true
Luke,Stewart,AgriGrow Inc,luke.stewart@agrigrow.com,Cold Call,Agriculture,420000,16,Owner,Closed - Not Converted,false
Madison,Sanchez,NanoTech Labs,madison.sanchez@nanotech.com,Web,Technology,8700000,400,CTO,Closed - Converted,true
Gavin,Morris,LegalFirst Partners,gavin.morris@legalfirst.com,Partner,Legal,2400000,100,Partner,Closed - Converted,true
Kylie,Rogers,TruckLine Logistics,kylie.rogers@truckline.com,Trade Show,Transportation,1600000,62,Director,Closed - Not Converted,false
Mason,Reed,AppDev Solutions,mason.reed@appdev.com,Web,Technology,12500000,575,CEO,Closed - Converted,true
Zoe,Cook,FoodBrand Co,zoe.cook@foodbrand.com,Cold Call,Food & Beverage,580000,22,Manager,Closed - Not Converted,false
Tristan,Morgan,FinServe Group,tristan.morgan@finserve.com,Referral,Finance,7100000,330,VP Finance,Closed - Converted,true
Isabella,Bell,MicroHealth Inc,isabella.bell@microhealth.com,Web,Healthcare,9400000,435,Director,Closed - Converted,true
Liam,Murphy,SmallRetail LLC,liam.murphy@smallretail.com,Trade Show,Retail,310000,11,Owner,Closed - Not Converted,false
Emma,Bailey,NextGen Software,emma.bailey@nextgen.com,Partner,Technology,11100000,510,CTO,Closed - Converted,true
Noah,Rivera,EnergyCo Inc,noah.rivera@energyco.com,Web,Energy,6400000,295,VP Operations,Closed - Converted,true
Ava,Cooper,ConsultGroup,ava.cooper@consultgroup.com,Referral,Consulting,4600000,195,Director,Closed - Not Converted,false
Ethan,Richardson,CloudMobile Tech,ethan.richardson@cloudmobile.com,Web,Technology,13900000,640,CEO,Closed - Converted,true
Mia,Cox,HomeSafe Insurance,mia.cox@homesafe.com,Cold Call,Insurance,2700000,115,Manager,Closed - Not Converted,false
Lucas,Howard,DataFirst Analytics,lucas.howard@datafirst.com,Referral,Technology,8100000,375,CTO,Closed - Converted,true
Chloe,Ward,QuickBite Foods,chloe.ward@quickbite.com,Trade Show,Food & Beverage,760000,29,Owner,Closed - Not Converted,false
Jackson,Torres,TechEdge Ventures,jackson.torres@techedge.com,Web,Technology,10400000,480,CEO,Closed - Converted,true
Grace,Peterson,MedSupply Corp,grace.peterson@medsupply.com,Partner,Healthcare,5900000,275,VP Sales,Closed - Converted,true
Aiden,Gray,BuildFast Construction,aiden.gray@buildfast.com,Cold Call,Construction,890000,35,Manager,Closed - Not Converted,false
Lily,Ramirez,SkyData Cloud,lily.ramirez@skydata.com,Web,Technology,15800000,720,CTO,Closed - Converted,true
Oliver,James,AutoParts Plus,oliver.james@autoparts.com,Trade Show,Automotive,1300000,50,Director,Closed - Not Converted,false
Ella,Watson,GlobalFinance Corp,ella.watson@globalfinance.com,Referral,Finance,9100000,420,VP Finance,Closed - Converted,true
James,Brooks,EduConnect,james.brooks@educonnect.com,Web,Education,2900000,120,Director,Closed - Not Converted,false
Sofia,Kelly,SecureIT Systems,sofia.kelly@secureit.com,Partner,Technology,12100000,555,CISO,Closed - Converted,true
William,Sanders,HealthStream,william.sanders@healthstream.com,Referral,Healthcare,7400000,345,CMO,Closed - Converted,true
Charlotte,Price,LocalShop LLC,charlotte.price@localshop.com,Cold Call,Retail,250000,9,Owner,Closed - Not Converted,false
Benjamin,Bennett,CloudPath Inc,benjamin.bennett@cloudpath.com,Web,Technology,14700000,675,CEO,Closed - Converted,true
Amelia,Wood,LawGroup Partners,amelia.wood@lawgroup.com,Trade Show,Legal,3100000,128,Partner,Closed - Converted,true
Elijah,Barnes,FarmFresh Supply,elijah.barnes@farmfresh.com,Cold Call,Agriculture,490000,18,Owner,Closed - Not Converted,false
Hannah,Ross,BioResearch Labs,hannah.ross@bioresearch.com,Web,Healthcare,10600000,490,VP Research,Closed - Converted,true
Alexander,Henderson,ConnectTech,alexander.henderson@connecttech.com,Referral,Technology,8400000,390,CTO,Closed - Converted,true
Avery,Coleman,StyleBox Retail,avery.coleman@stylebox.com,Trade Show,Retail,940000,37,Director,Closed - Not Converted,false
Sebastian,Jenkins,RiskGuard Insurance,sebastian.jenkins@riskguard.com,Partner,Insurance,6300000,290,VP Sales,Closed - Converted,true
Scarlett,Perry,LogiFlow Logistics,scarlett.perry@logiflow.com,Web,Transportation,3800000,155,Director,Closed - Not Converted,false
Jack,Powell,AlphaCode Software,jack.powell@alphacode.com,Web,Technology,13200000,610,CEO,Closed - Converted,true
Aria,Long,NutriHealth Corp,aria.long@nutrihealth.com,Referral,Healthcare,5500000,255,VP Marketing,Closed - Converted,true
Henry,Patterson,CraftBrew Co,henry.patterson@craftbrew.com,Cold Call,Food & Beverage,620000,24,Manager,Closed - Not Converted,false
Nora,Hughes,DataVault Systems,nora.hughes@datavault.com,Web,Technology,11400000,525,CTO,Closed - Converted,true
Owen,Flores,UrbanRealty,owen.flores@urbanrealty.com,Trade Show,Real Estate,2600000,108,Director,Closed - Not Converted,false
Luna,Washington,PrimeCare Medical,luna.washington@primecare.com,Partner,Healthcare,8800000,405,CMO,Closed - Converted,true
Wyatt,Butler,GreenBuild LLC,wyatt.butler@greenbuild.com,Web,Construction,1700000,65,VP Operations,Closed - Converted,true
Penelope,Simmons,MiniMart Stores,penelope.simmons@minimart.com,Cold Call,Retail,430000,16,Owner,Closed - Not Converted,false
Levi,Foster,CloudSpeak AI,levi.foster@cloudspeak.com,Referral,Technology,16000000,735,CEO,Closed - Converted,true
Violet,Gonzales,MidWest Finance,violet.gonzales@midwest.com,Web,Finance,5300000,245,VP Finance,Closed - Converted,true
Harrison,Bryant,QuickFreight Co,harrison.bryant@quickfreight.com,Trade Show,Transportation,2000000,82,Director,Closed - Not Converted,false
Aurora,Alexander,PharmaLife Inc,aurora.alexander@pharmalife.com,Partner,Healthcare,12800000,590,VP Research,Closed - Converted,true
Dominic,Russell,NetSecurity Corp,dominic.russell@netsecurity.com,Web,Technology,9700000,450,CISO,Closed - Converted,true
Savannah,Griffin,TinyTech LLC,savannah.griffin@tinytech.com,Cold Call,Technology,340000,12,Owner,Closed - Not Converted,false
Eli,Diaz,AgriData Systems,eli.diaz@agridata.com,Trade Show,Agriculture,670000,26,Manager,Closed - Not Converted,false
Bella,Hayes,CoreLogic Software,bella.hayes@corelogic.com,Referral,Technology,10900000,500,CTO,Closed - Converted,true
Grayson,Myers,InsureGroup,grayson.myers@insuregroup.com,Web,Insurance,7200000,335,VP Sales,Closed - Converted,true
Stella,Ford,HealthEdge Inc,stella.ford@healthedge.com,Partner,Healthcare,6600000,305,Director,Closed - Converted,true
Ryker,Hamilton,LocalMover Corp,ryker.hamilton@localmover.com,Cold Call,Transportation,520000,19,Owner,Closed - Not Converted,false
Zoey,Graham,DataBridge Analytics,zoey.graham@databridge.com,Web,Technology,14500000,665,CEO,Closed - Converted,true
```

Save this file as `sample_leads.csv` on your Desktop.

---

### Step 2: Import Lead Data Using Data Import Wizard

In Salesforce, click the **gear icon** > **Setup**.

In Quick Find, type `Data Import Wizard` and click the result.

📸 **What you should see:** The Data Import Wizard page opens. It shows a step-by-step wizard with options for what type of data to import. There are two options shown visually: "Standard Salesforce Objects" and "Custom Objects."

Click **"Launch Wizard!"**

---

### Step 3: Configure the Import

In the wizard, under **"What kind of data are you importing?"**, select **"Leads"**.

Under **"What do you want to do?"**, select **"Add new and update existing records"**.

Under **"Match leads by"**, select **"Email"**.

Click **"Next"**.

---

### Step 4: Upload Your CSV File

Click **"Browse"** or drag your `sample_leads.csv` file into the upload area.

📸 **What you should see:** The file name appears and the wizard shows a preview of the first few rows of your data, mapping columns from your CSV to Salesforce Lead fields.

---

### Step 5: Map the Fields

The wizard will attempt to auto-map your CSV columns to Lead fields. Review the mapping:

| CSV Column | Salesforce Field |
|-----------|-----------------|
| FirstName | First Name |
| LastName | Last Name |
| Company | Company |
| Email | Email |
| LeadSource | Lead Source |
| Industry | Industry |
| AnnualRevenue | Annual Revenue |
| NumberOfEmployees | Number of Employees |
| Title | Title |
| Status | Status |

> **Note:** The `IsConverted` column cannot be imported via the standard import wizard (it's a system-managed field). That's OK — Einstein Prediction Builder will use the `IsConverted` field that Salesforce sets when leads are converted via the standard Convert button.

Click **"Next"**.

---

### Step 6: Complete the Import

Review the summary showing the number of records to import.

Click **"Start Import"**.

📸 **What you should see:** A confirmation message: "Your import has been submitted. You will receive an email when the import is complete." The import typically finishes within 2-5 minutes.

> **Check results:** Go to Setup > Data Import Wizard > View Results (or check the email notification) to confirm all records imported without errors.

---

## Part 2: Create the Lead Conversion Prediction

### Step 7: Navigate to Einstein Prediction Builder

In Setup, Quick Find: type `Prediction Builder` and click **"Einstein Prediction Builder"**.

📸 **What you should see:** The Prediction Builder page opens. If you've never used it before, you may see an introductory screen with a "Get Started" or "New Prediction" button. If you see a list view, you'll see a "New Prediction" button in the top-right corner.

---

### Step 8: Start a New Prediction

Click **"New Prediction"**.

📸 **What you should see:** A multi-step wizard begins. Step 1 is typically labeled "Name and Object."

---

### Step 9: Name Your Prediction

Fill in:

| Field | Value |
|-------|-------|
| `Prediction Name` | `Lead Conversion Likelihood` |
| `Description` | `Predicts which leads are most likely to be converted based on historical patterns` |
| `Object` | Click the dropdown and select **"Lead"** |

Click **"Next"**.

---

### Step 10: Define the Prediction Outcome

📸 **What you should see:** Step 2 is labeled "Prediction Type" or "What do you want to predict?"

You'll see options:
- **Binary Prediction** — Will something happen or not? (Yes/No)
- **Score Prediction** — What numeric value will something have?

Select **"Binary Prediction"** (we want to predict: will this lead convert? Yes or No).

Click **"Next"**.

---

### Step 11: Configure the Outcome Field

📸 **What you should see:** A screen asking you to define the outcome. There are two approaches:

**Option A: Predict a Field Value**
- Field: Select `Converted`
- Outcome (when the prediction is true): Select `True`

Select **"Predict a Field's Value"**, choose the **"Converted"** field, and set the condition to **"equals True"**.

This tells Einstein: "I want to predict when a Lead's Converted field will become True."

Click **"Next"**.

---

### Step 12: Set the Segmentation (Optional)

📸 **What you should see:** A screen asking if you want to segment your training data. This allows you to build the model on a subset of leads (e.g., only leads from a specific industry).

For this lab, leave the segmentation as **"All records"** (no filter). This trains the model on all of your Lead data.

Click **"Next"**.

---

### Step 13: Select Features (Input Fields)

📸 **What you should see:** A screen showing available fields from the Lead object. These are the **input features** Einstein will analyze to find patterns.

Select the following fields by checking their checkboxes:

- [x] `Lead Source`
- [x] `Industry`
- [x] `Annual Revenue`
- [x] `Number of Employees`
- [x] `Title`

> **Why these fields?** These are likely predictors of conversion. Einstein will determine which ones actually matter — you're just giving it candidates to analyze.

Click **"Next"**.

---

### Step 14: Review and Train

📸 **What you should see:** A summary screen showing your prediction configuration:
- Prediction Name: Lead Conversion Likelihood
- Object: Lead
- Outcome: Converted = True
- Features: The 5 fields you selected

Review the summary. If everything looks correct, click **"Train Model"** or **"Save and Train"**.

📸 **What you should see:** A confirmation message: "Your prediction is being built. This may take a few minutes to a few hours depending on data volume." The prediction appears in your list with a status of "Training."

> **Take a break!** Model training typically takes 10-30 minutes for small datasets. This is a good time to review course notes or take a 15-minute break. Do NOT close the browser — the training happens on Salesforce servers, so you can safely navigate away and come back.

---

## Part 3: Analyze the Prediction Dashboard

After training is complete, you'll receive a notification or can check back to see the results.

### Step 15: Open the Trained Prediction

Go to Setup > Quick Find: `Prediction Builder`. Click on your **"Lead Conversion Likelihood"** prediction.

📸 **What you should see:** The Prediction Detail page opens. You'll see several key sections:

1. **Prediction Status:** Should show "Active" or "Ready"
2. **Model Summary:** Shows accuracy metrics
3. **Top Predictors:** The fields that most influenced the prediction
4. **Score Distribution:** A histogram showing how leads are distributed across score ranges

---

### Step 16: Read the Model Summary

Find the **Model Accuracy** section. Look for these metrics:

- **Accuracy:** The percentage of predictions the model gets right (e.g., 78%)
- **Area Under Curve (AUC):** A number between 0 and 1. Higher is better. AUC above 0.7 is considered good.
- **Precision and Recall:** These appear in some versions of the dashboard.

📸 **What you should see:** A card or table with numeric values for the model's performance. For our sample data of 110 records, don't expect perfect accuracy — you need thousands of records for highly accurate models. What matters is understanding how to READ these metrics.

> **Exam tip:** The AI Associate exam asks you to understand what "model accuracy" means, not to calculate it. If AUC = 0.5, the model is no better than random guessing. AUC = 1.0 would be a perfect model (unrealistic). Aim for 0.7+.

---

### Step 17: Review Top Predictors

Find the **Top Predictors** section. This shows which fields had the most influence on the model's predictions.

📸 **What you should see:** A ranked list or bar chart showing fields like:
- Lead Source — High influence
- Annual Revenue — Medium influence
- Number of Employees — Medium influence
- Industry — Low influence

This section tells you what patterns Einstein found. For example, if "Lead Source = Web" has high predictive power, it means web leads historically convert at a significantly different rate than other lead sources.

---

### Step 18: View Score Distribution

Find the **Score Distribution** histogram.

📸 **What you should see:** A bar chart where the x-axis shows prediction score ranges (0-10%, 10-20%, etc.) and the y-axis shows the number of Lead records in each range. Ideally, you'll see most leads clustered at the low end (unlikely to convert) and a smaller cluster at the high end (likely to convert). This bell curve or bimodal distribution indicates a well-trained model.

---

## Part 4: View Prediction Scores on Lead Records

### Step 19: Navigate to a Lead Record

Click the **App Launcher** and navigate to **"Leads"** (in the Sales app or Service app).

Click on any Lead from your imported list.

📸 **What you should see:** The Lead detail page. Scroll down to look for a section or field called **"Lead Conversion Likelihood Score"** or similar.

> **Note:** Prediction scores appear on records after you activate the prediction AND add the score field to the page layout. Let's do that now.

---

### Step 20: Add the Prediction Score to the Lead Page Layout

Go to Setup > Quick Find: type `Object Manager`.

Click **"Object Manager"** and then click **"Lead"** in the list.

Click **"Page Layouts"** in the left sidebar.

Click **"Lead Layout"** to edit it.

📸 **What you should see:** The page layout editor opens. It shows a visual representation of the Lead record page with sections and fields arranged in columns.

In the **Fields** palette at the top, search for `Prediction` or your prediction name.

Drag the **"Lead Conversion Likelihood Score"** field (or similar) to a section on the layout.

Click **"Save"**.

---

### Step 21: View the Score on a Lead Record

Go back to the Leads list and click on any Lead.

📸 **What you should see:** The Lead record now shows a prediction score field, typically displayed as a percentage (e.g., "73%") or a decimal (0.73). This is Einstein's prediction of how likely this lead is to convert.

Leads with scores above 70% are your hottest leads. Sales reps can sort/filter the Lead list view by this score field to prioritize their outreach.

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Data Import Wizard shows mapping errors | Check that your CSV column headers exactly match the expected format. Remove any special characters. Re-download and try again. |
| Import completes but shows 0 records imported | Check the import results log (Setup > View Import Results). Common cause: duplicate email addresses in your CSV. |
| Prediction Builder shows "Not enough data to train" | You need sufficient records with known outcomes. Ensure your CSV imported successfully (100+ records). Check the Leads list view to confirm records exist. |
| Training status stays at "In Progress" for over 2 hours | This may indicate an issue. Try creating a new prediction (training issues sometimes resolve by restarting). Contact Salesforce Support if it persists. |
| Prediction score field not visible on Lead record | Ensure you added the field to the page layout in Step 20. Also confirm the prediction is in "Active" status (not "Draft" or "Training"). |
| AUC shows 0.5 or accuracy is very low | With only 110 records and a simplified dataset, low accuracy is expected. In real-world scenarios, you'd train on thousands of records. Focus on understanding the workflow rather than the metric values. |

---

## Reflection Questions

1. Einstein Prediction Builder analyzed your Lead data and identified **Top Predictors** — the fields most correlated with conversion. Looking at your Top Predictors result, does the list make intuitive business sense? For example, if "Lead Source = Web" is a top predictor, why might web leads convert at a different rate than trade show leads?

2. The model dashboard shows an **AUC (Area Under Curve)** score. In plain language that a non-technical VP of Sales would understand, how would you explain what AUC means and why a higher score is better?

3. Einstein Prediction Builder is classified as a **predictive AI** feature, while Prompt Builder (Lab 2) uses **generative AI**. What is the fundamental difference between these two types of AI? In which business scenarios would you choose predictive AI over generative AI?

---

## Summary

In this lab you:
- Created 110+ realistic Lead records using the Data Import Wizard
- Configured a Binary Prediction to predict Lead conversion
- Trained an Einstein machine learning model (no code required)
- Analyzed the model accuracy dashboard, top predictors, and score distribution
- Added prediction scores to the Lead record page layout

This covers a significant portion of the **"Einstein for Sales"** and **"AI Capabilities in CRM"** exam domains.

**Next:** Proceed to Lab 4: Next Best Action Setup.
