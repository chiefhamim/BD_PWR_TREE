'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'EN' | 'BN';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  formatNum: (num: number, maxFractions?: number) => string;
  formatCurrency: (num: number, forceCurrency?: 'BDT' | 'USD') => string;
  translateKpi: (value: string | number | undefined, unit: string | undefined) => { value: string; unit: string };
  currency: 'BDT' | 'USD';
  toggleCurrency: () => void;
  exchangeRate: number;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const DICTIONARY: Record<string, string> = {
  // Common
  'Live Markets': 'লাইভ মার্কেট',
  
  // Designations
  'Ministry': 'মন্ত্রণালয়',
  'Division': 'বিভাগ',
  'Independent Regulator': 'স্বাধীন নিয়ন্ত্রক সংস্থা',
  'Generation Company': 'বিদ্যুৎ উৎপাদন কোম্পানি',
  'Generation Sub-unit': 'উৎপাদন ইউনিট',
  'Transmission Company': 'সঞ্চালন কোম্পানি',
  'Distribution Company': 'বিতরণ কোম্পানি',
  
  // Dashboard Metrics
  'Active Gen': 'চলমান উৎপাদন',
  'Installed': 'স্থাপিত ক্ষমতা',
  'Peak Est': 'চাহিদার পূর্বাভাস',
  'Bulk Price': 'পাইকারি মূল্য',
  'Sys Loss': 'সিস্টেম লস',
  'Green Mix': 'নবায়নযোগ্য জ্বালানি',
  'Grid Sync': 'গ্রিড সিঙ্ক',
  'Gas Supply': 'গ্যাস সরবরাহ',
  'Fuel Import': 'জ্বালানি আমদানি',
  'Load Flow Model': 'লোড ফ্লো মডেল',
  
  // Tooltips & Actions
  'Vertical View': 'উল্লম্ব ভিউ',
  'Horizontal View': 'অনুভূমিক ভিউ',
  'Reset Flow Layout': 'ফ্লো লেআউট রিসেট করুন',
  'Center Canvas': 'ক্যানভাস সেন্টারে আনুন',
  'Zoom In': 'জুম ইন',
  'Zoom Out': 'জুম আউট',
  'Lock Grid': 'গ্রিড লক করুন',
  'Unlock Grid': 'গ্রিড আনলক করুন',
  'View System Details': 'সিস্টেম বিস্তারিত দেখুন',

  'Load Shed': 'লোড শেডিং',
  'Cap. Charge': 'ক্যাপাসিটি চার্জ',
  'Voltage': 'ভোল্টেজ',
  'Source': 'উৎস',
  'Updated': 'আপডেট',
  'System Live': 'সিস্টেম লাইভ',
  'Last Updated': 'সর্বশেষ আপডেট',
  'SECURE': 'নিরাপদ',
  'kV': 'কেভি',
  
  // Dashboard Modal
  'Active Generation': 'চলমান বিদ্যুৎ উৎপাদন',
  'Real-time power being generated and fed into the national grid.': 'জাতীয় গ্রিডে এই মুহূর্তে উৎপাদিত ও সরবরাহকৃত বিদ্যুতের রিয়েল-টাইম পরিমাণ।',
  'Current Output': 'বর্তমান উৎপাদন',
  'Day Peak': 'দিনের সর্বোচ্চ',
  'Base Load': 'বেস লোড',
  
  'Installed Capacity': 'স্থাপিত ক্ষমতা',
  'Total nameplate capacity of all power plants connected to the grid.': 'জাতীয় গ্রিডের সাথে সংযুক্ত দেশের সকল বিদ্যুৎ কেন্দ্রের সম্মিলিত উৎপাদন সক্ষমতা।',
  'Total Capacity': 'মোট সক্ষমতা',
  'Derated Capacity': 'প্রকৃত সক্ষমতা',
  'Reserve Margin': 'রিজার্ভ মার্জিন',
  
  'Peak Demand Estimate': 'সর্বোচ্চ চাহিদার পূর্বাভাস',
  'Estimated maximum demand for the current day during evening peak hours.': 'আজ সন্ধ্যার পিক আওয়ারে দেশব্যাপী বিদ্যুতের সম্ভাব্য সর্বোচ্চ চাহিদার হিসাব।',
  'Evening Peak': 'সন্ধ্যার পিক আওয়ার',
  'Time Estimate': 'সম্ভাব্য সময়সূচি',
  'Previous Day': 'গতকালের চাহিদা',
  
  'Average Bulk Price': 'গড় পাইকারি মূল্য',
  'The weighted average bulk electricity selling price to distribution companies.': 'বিতরণ কোম্পানিগুলোর কাছে পিডিবির পাইকারি বিদ্যুৎ বিক্রির গড় রেট।',
  'Bulk Tariff': 'পাইকারি ট্যারিফ',
  'Retail Avg': 'গড় খুচরা মূল্য',
  'Subsidy Est': 'ভর্তুকির হিসাব',
  
  'System Loss': 'সিস্টেম লস',
  'Combined Transmission and Distribution (T&D) losses across the national grid.': 'জাতীয় গ্রিডে সঞ্চালন ও বিতরণ প্রক্রিয়ায় সার্বিক বিদ্যুতের অপচয় বা কারিগরি লস।',
  'Overall Loss': 'সার্বিক লস',
  'Transmission': 'সঞ্চালন লস',
  'Distribution': 'বিতরণ লস',
  
  'Renewable Energy Mix': 'নবায়নযোগ্য জ্বালানির মিশ্রণ',
  'Percentage of total installed capacity derived from renewable sources.': 'দেশের মোট স্থাপিত বিদ্যুৎ সক্ষমতার কত শতাংশ নবায়নযোগ্য ও পরিচ্ছন্ন শক্তি থেকে আসছে।',
  'Total Green': 'মোট পরিচ্ছন্ন শক্তি',
  'Solar Share': 'সৌরবিদ্যুতের অবদান',
  'Hydro Share': 'জলবিদ্যুতের অবদান',
  'Close Panel': 'বন্ধ করুন',
  
  'National Gas Supply': 'জাতীয় গ্যাস সরবরাহ',
  'Total natural gas supplied daily to the national grid by Petrobangla and LNG terminals.': 'পেট্রোবাংলা এবং এলএনজি টার্মিনাল থেকে প্রতিদিন জাতীয় গ্রিডে সরবরাহকৃত মোট প্রাকৃতিক গ্যাসের পরিমাণ।',
  'Total Supply': 'মোট সরবরাহ',
  'Power Sector Use': 'বিদ্যুৎ খাতে ব্যবহার',
  'LNG Import': 'এলএনজি আমদানি',
  
  'Primary Fuel Imports': 'প্রাথমিক জ্বালানি আমদানি',
  'Annual import volume of major fossil fuels (Coal, HFO, HSD) for power generation.': 'বিদ্যুৎ উৎপাদনের জন্য প্রয়োজনীয় প্রধান জীবাশ্ম জ্বালানিগুলোর (কয়লা, ফার্নেস অয়েল, ডিজেল) বার্ষিক আমদানির পরিমাণ।',
  'Coal Imports': 'কয়লা আমদানি',
  'Furnace Oil': 'ফার্নেস অয়েল',
  'Diesel': 'ডিজেল',
  
  'Estimated Load Shedding': 'সম্ভাব্য লোড শেডিং',
  'The power deficit between evening peak demand and active generation.': 'সন্ধ্যার পিক আওয়ারে বিদ্যুতের চাহিদা এবং বর্তমান উৎপাদনের মধ্যকার ঘাটতি বা লোড শেডিংয়ের পরিমাণ।',
  'Current Deficit': 'বর্তমান ঘাটতি',
  'Rural Areas': 'গ্রামীণ অঞ্চল',
  'Urban Areas': 'শহরাঞ্চল',
  
  'Annual Capacity Charge': 'বার্ষিক ক্যাপাসিটি চার্জ',
  'Fixed payments to IPPs and rental power plants to keep them on standby.': 'বেসরকারি বিদ্যুৎ কেন্দ্রগুলোকে (IPP ও Rental) অলস বসিয়ে রেখে সরকার যে কেন্দ্রভাড়া বা ক্যাপাসিটি চার্জ প্রদান করে।',
  'Annual Cost': 'বার্ষিক খরচ',
  'IPPs Share': 'আইপিপি অংশ',
  'Rentals Share': 'রেন্টাল অংশ',
  
  // Tree Nodes
  'Ministry of Power, Energy & Mineral Resources': 'বিদ্যুৎ, জ্বালানি ও খনিজ সম্পদ মন্ত্রণালয়',
  'Power Division': 'বিদ্যুৎ বিভাগ',
  'Energy and Mineral Resources Division': 'জ্বালানি ও খনিজ সম্পদ বিভাগ',
  'Bangladesh Energy Regulatory Commission': 'বাংলাদেশ এনার্জি রেগুলেটরি কমিশন (বিইআরসি)',
  'BPDB (Bangladesh Power Development Board)': 'বাংলাদেশ বিদ্যুৎ উন্নয়ন বোর্ড (পিডিবি)',
  'BPDB Coal Plants': 'পিডিবি কয়লাভিত্তিক বিদ্যুৎ কেন্দ্র',
  'BPDB Gas Plants': 'পিডিবি গ্যাসভিত্তিক বিদ্যুৎ কেন্দ্র',
  'BPDB Hydro Plants': 'পিডিবি জলবিদ্যুৎ কেন্দ্র',
  'BPDB Solar & Wind': 'পিডিবি সৌর ও বায়ু বিদ্যুৎ',
  'NWPGCL (North-West Power)': 'এনডব্লিউপিজিসিএল (নর্থ-ওয়েস্ট পাওয়ার)',
  'APSCL (Ashuganj Power)': 'এপিএসসিএল (আশুগঞ্জ পাওয়ার)',
  'EGCB': 'ইজিসিবি',
  'Payra Power Plant (BCPCL)': 'পায়রা বিদ্যুৎ কেন্দ্র (বিসিপিসিএল)',
  'Matarbari Power Plant (CPGCBL)': 'মাতারবাড়ী বিদ্যুৎ কেন্দ্র (সিপিজিসিবিএল)',
  'Rampal Power Plant (B-IFPCL)': 'রামপাল বিদ্যুৎ কেন্দ্র (বি-আইএফপিসিএল)',
  'Rooppur Nuclear Power Plant': 'রূপপুর পারমাণবিক বিদ্যুৎ কেন্দ্র',
  'BPC (Bangladesh Petroleum Corp)': 'বিপিসি (বাংলাদেশ পেট্রোলিয়াম কর্পোরেশন)',
  'Bheramara HVDC (India Import)': 'ভেড়ামারা এইচভিডিসি (ভারত থেকে আমদানি)',
  'Summit Power': 'সামিট পাওয়ার',
  'United Power': 'ইউনাইটেড পাওয়ার',
  'Confidence Power': 'কনফিডেন্স পাওয়ার',
  'Other IPPs & Private Generators': 'অন্যান্য আইপিপি ও বেসরকারি বিদ্যুৎ কেন্দ্র',
  'Rental Power Plants': 'রেন্টাল ও কুইক রেন্টাল বিদ্যুৎ কেন্দ্র',
  'Adani Godda (India Import)': 'আদানি গোড্ডা (ভারত থেকে আমদানি)',
  'Tripura Import (India)': 'ত্রিপুরা থেকে আমদানি (ভারত)',
  'Petrobangla': 'পেট্রোবাংলা',
  'RPGCL (LNG Terminals)': 'আরপিজিসিএল (এলএনজি টার্মিনাল)',
  'Coal Suppliers': 'কয়লা সরবরাহকারী প্রতিষ্ঠান',
  'Renewable Energy Sources': 'নবায়নযোগ্য জ্বালানির উৎস',
  'PGCB (National Grid)': 'পাওয়ার গ্রিড কোম্পানি (পিজিসিবি)',
  'NLDC (National Load Despatch Centre)': 'ন্যাশনাল লোড ডেসপ্যাচ সেন্টার (এনএলডিসি)',
  'DPDC (Dhaka South Distribution)': 'ডিপিডিসি (ঢাকা দক্ষিণ বিতরণ)',
  'DESCO (Dhaka North Distribution)': 'ডেসকো (ঢাকা উত্তর বিতরণ)',
  'BREB (Rural Electrification Board)': 'পল্লী বিদ্যুতায়ন বোর্ড (আরইবি)',
  'NESCO (North Distribution)': 'নেসকো (উত্তরাঞ্চল বিতরণ)',
  'WZPDC (West/South Distribution)': 'ওয়েস্ট জোন পাওয়ার ডিস্ট্রিবিউশন কোম্পানি (WZPDC)',
  'Industrial Consumers': 'শিল্প খাতের গ্রাহক',
  'Commercial Consumers': 'বাণিজ্যিক খাতের গ্রাহক',
  'Agricultural Consumers': 'কৃষি খাতের গ্রাহক (সেচ)',
  'Residential Consumers': 'আবাসিক খাতের গ্রাহক',
  
  // Designations & Roles
  'Independent Power Producer': 'বেসরকারি বিদ্যুৎ উৎপাদনকারী',
  'State-owned Corporation': 'রাষ্ট্রায়ত্ত কর্পোরেশন',
  'Exploration & Production': 'অনুসন্ধান ও উৎপাদন',
  'Oil Refinery': 'তেল শোধনাগার',
  'Oil Marketing Company': 'তেল বিপণন কোম্পানি',
  'Rural Distribution': 'পল্লী বিদ্যুৎ বিতরণ',
  'Rural Co-operatives': 'পল্লী সমবায় সমিতি',
  'IPP': 'আইপিপি (IPP)',
  'IPP Group': 'আইপিপি গ্রুপ',
  'Emergency Generation': 'জরুরি বিদ্যুৎ উৎপাদন',
  'Import': 'আন্তঃদেশীয় আমদানি',
  'Cross-border Import': 'আন্তঃদেশীয় বিদ্যুৎ আমদানি',
  'Fuel Supplier': 'জ্বালানি সরবরাহকারী',
  'Grid Operations': 'গ্রিড অপারেশন ও নিয়ন্ত্রণ',
  'Consumer Segment': 'গ্রাহক শ্রেণি',
  'Single Buyer & Generator': 'একক ক্রেতা ও উৎপাদনকারী',
  'State Generator': 'রাষ্ট্রীয় বিদ্যুৎ কেন্দ্র',
  'JV Generator': 'যৌথ উদ্যোগের কেন্দ্র',
  'Nuclear Generator': 'পারমাণবিক বিদ্যুৎ কেন্দ্র',
  'Gas Authority': 'গ্যাস কর্তৃপক্ষ',
  'LNG Importer': 'এলএনজি আমদানিকারক',
  'Oil Authority': 'তেল কর্তৃপক্ষ',
  'Bulk Importers': 'বাল্ক আমদানিকারক',

  // Units
  'MW Capacity': 'মেগাওয়াট (MW) সক্ষমতা',
  'MW Supervised': 'তদারকিকৃত মেগাওয়াট',
  'Total MW': 'মোট মেগাওয়াট',
  'MW (Approx)': 'আনুমানিক মেগাওয়াট',
  'MW Peak': 'সর্বোচ্চ মেগাওয়াট (পিক)',
  'MW Target': 'মেগাওয়াট লক্ষ্যমাত্রা',
  'MW Real-time': 'রিয়েল-টাইম মেগাওয়াট',
  'Circuit KM': 'সার্কিট কি.মি.',
  'MMcfd Gas': 'এমএমসিএফডি গ্যাস',
  'MMTPA': 'এমএমটিপিএ (MMTPA)',
  '/ vori': '/ ভরি',
  'Vori': 'ভরি',
  'Tariff Changes/Year': 'ট্যারিফ পরিবর্তন/বছর',
  'Billion Cubic Feet/Yr': 'বিলিয়ন ঘনফুট/বছর',
  'Billion Cubic Feet': 'বিলিয়ন ঘনফুট (BCF)',
  'B ৳': 'বিলিয়ন ৳',
  'Lakh ৳': 'লাখ ৳',
  'লাখ ৳': 'লাখ ৳',
  'koti ৳': 'কোটি ৳',
  'mmcfd': 'এমএমসিএফডি',
  'MMcfd': 'এমএমসিএফডি',
  'MMT': 'এমএমটি (মিলিয়ন টন)',
  'MMcf/d': 'এমএমসিএফডি',
  'Grid Substations': 'গ্রিড সাবস্টেশন',
  'km Lines': 'কিলোমিটার লাইন',
  'Million Consumers': 'মিলিয়ন গ্রাহক',
  'Lakh Consumers': 'লাখ গ্রাহক',
  'Koti MT': 'কোটি মেট্রিক টন',
  'Koti cfd': 'কোটি ঘনফুট/দিন',
  'Million Metric Tons': 'মিলিয়ন মেট্রিক টন',
  'Million Tonnes/Year': 'মিলিয়ন টন/বছর',
  'MW Demand': 'মেগাওয়াট চাহিদা',
  'MW': 'মেগাওয়াট',
  '৳/Unit': '৳/ইউনিট',
  '%': '%',
  'Cr BDT Budget': 'কোটি টাকা (বাজেট)',
  'MW Installed': 'মেগাওয়াট (স্থাপিত)',
  'MMcfd Gas Supply': 'এমএমসিএফডি (গ্যাস সরবরাহ)',
  'Tk/kWh Retail': 'টাকা/কিলোওয়াট-ঘণ্টা (খুচরা)',
  'Unit': 'ইউনিট',
  'MW RE': 'মেগাওয়াট (নবায়নযোগ্য)',
  'Vacancies': 'শূন্যপদ',
  'Cr BDT Loss': 'কোটি টাকা (লোকসান)',
  'Tk/kWh': 'টাকা/কিলোওয়াট-ঘণ্টা',
  'Cr BDT Charge': 'কোটি টাকা (চার্জ)',
  'M Tonnes': 'মিলিয়ন টন',
  '% Sys Loss': '% (সিস্টেম লস)',
  '% Demand': '% (চাহিদা)',
  'MoPEMR': 'বিদ্যুৎ ও জ্বালানি মন্ত্রণালয়',
  'BPDB Database': 'পিডিবি ডাটাবেস',

  // UI Elements & Drill Panel
  'Bangladesh Power Sector': 'বাংলাদেশ বিদ্যুৎ খাত',
  'Interactive Hierarchy': 'ইন্টারেক্টিভ গ্রিড হায়ারার্কি',
  'entities': 'প্রতিষ্ঠান',
  'Entities': 'প্রতিষ্ঠানসমূহ',
  'Total Entities': 'মোট প্রতিষ্ঠানসমূহ',
  'Click nodes for details': 'বিস্তারিত দেখতে নোডগুলোতে ক্লিক করুন',
  'View': 'ভিউ',
  'Vertical': 'উল্লম্ব',
  'Horizontal': 'অনুভূমিক',
  'Reset Layout': 'লেআউট রিসেট করুন',
  'Categories': 'খাতসমূহ',
  'Primary Metric': 'মূল সূচক',
  'Description': 'বিবরণ',
  'Designation': 'ধরন বা পদবি',
  'Status': 'বর্তমান অবস্থা',
  'Website': 'ওয়েবসাইট',
  'Daily Cost': 'দৈনিক খরচ',
  'Monthly Cost': 'মাসিক খরচ',
  'Yearly Cost': 'বার্ষিক খরচ',
  'Daily Volume': 'দৈনিক সরবরাহ',
  'Monthly Volume': 'মাসিক সরবরাহ',
  'Yearly Volume': 'বার্ষিক সরবরাহ',
  'Daily Import': 'দৈনিক আমদানি',
  'Monthly Import': 'মাসিক আমদানি',
  'Yearly Import': 'বার্ষিক আমদানি',
  'KMT': 'হাজার মেট্রিক টন (KMT)',
  'Lakh MT': 'লাখ মেট্রিক টন',
  'Grid Frequency': 'গ্রিড ফ্রিকোয়েন্সি',
  'Transmission Voltage': 'ট্রান্সমিশন ভোল্টেজ',
  'Distribution Voltage': 'ডিস্ট্রিবিউশন ভোল্টেজ',
  'Consumer Voltage': 'গ্রাহক ভোল্টেজ',
  '50.0 Hz (Target)': '৫০.০ হার্জ (টার্গেট)',
  '400kV / 230kV': '৪০০ কেভি / ২৩০ কেভি',
  '132kV / 33kV / 11kV': '১৩২ কেভি / ৩৩ কেভি / ১১ কেভি',
  '230V (Single) / 400V (3-Phase)': '২৩০ ভোল্ট (সিঙ্গেল) / ৪০০ ভোল্ট (থ্রি-ফেজ)',
  'Real-time frequency and voltage parameters of the Bangladesh National Grid.': 'বাংলাদেশ জাতীয় গ্রিডের রিয়েল-টাইম ফ্রিকোয়েন্সি এবং ভোল্টেজ প্যারামিটার।',
  'National Grid Status': 'জাতীয় গ্রিড স্ট্যাটাস',

    // Node Descriptions
  'The supreme policy-making body overseeing the entire energy and mineral resources sector, ensuring national energy security and sustainable growth.': 'দেশের জ্বালানি ও খনিজ সম্পদ খাতের সর্বোচ্চ নীতিনির্ধারণী সংস্থা; যা জাতীয় জ্বালানি নিরাপত্তা নিশ্চিতের পাশাপাশি টেকসই প্রবৃদ্ধির রূপরেখা প্রণয়ন করে।',
  'Responsible for the holistic management, strategic planning, and regulatory oversight of electricity generation, transmission, and distribution across the nation.': 'সারা দেশে বিদ্যুৎ উৎপাদন, সঞ্চালন ও বিতরণের সামগ্রিক ব্যবস্থাপনা, কৌশলগত পরিকল্পনা এবং তদারকিতে সরাসরি ভূমিকা পালনকারী প্রতিষ্ঠান।',
  'Coordinates the exploration, production, and import of primary fuels (gas, coal, oil) and spearheads renewable energy policy implementation.': 'প্রাথমিক জ্বালানির (গ্যাস, কয়লা, তেল) অনুসন্ধান, উৎপাদন ও আমদানি সমন্বয়ের পাশাপাশি নবায়নযোগ্য জ্বালানি নীতি বাস্তবায়নে নেতৃত্ব দিচ্ছে।',
  'An independent statutory body that ensures fair tariffs, promotes competition, and protects consumer rights in the electricity and downstream gas sectors.': 'বিদ্যুৎ ও গ্যাস খাতে ন্যায্য মূল্য নির্ধারণ, বাজার প্রতিযোগিতা সৃষ্টি এবং গ্রাহক অধিকার সুরক্ষায় নিয়োজিত একটি স্বাধীন সংবিধিবদ্ধ সংস্থা।',
  'The largest state-owned statutory body functioning as the single buyer of electricity and managing massive public generation facilities.': 'দেশের বিদ্যুৎ খাতের প্রধান নিয়ন্ত্রক; যা বিদ্যুতের একক ক্রেতা হিসেবে কাজ করার পাশাপাশি বৃহৎ সরকারি বিদ্যুৎকেন্দ্রগুলো সরাসরি পরিচালনা করে।',
  'Major baseload thermal power stations utilizing domestic and imported coal to maintain grid stability and meet base demand.': 'দেশের নিজস্ব ও আমদানিকৃত কয়লার সাহায্যে নিরবচ্ছিন্নভাবে বিদ্যুৎ উৎপাদন করে গ্রিডের স্থিতিশীলতা রক্ষায় নিয়োজিত বেসলোড তাপবিদ্যুৎ কেন্দ্রসমূহ।',
  'The backbone of the power grid, these stations use domestic natural gas and imported LNG to provide reliable and cost-effective electricity.': 'জাতীয় গ্রিডের মেরুদণ্ড হিসেবে পরিচিত এই কেন্দ্রগুলো নিজস্ব প্রাকৃতিক গ্যাস ও এলএনজি ব্যবহার করে নির্ভরযোগ্য এবং সাশ্রয়ী বিদ্যুৎ সরবরাহ করে আসছে।',
  'Eco-friendly renewable energy facilities harnessing water flow to provide essential peaking power and grid frequency regulation.': 'পানির প্রবাহ কাজে লাগিয়ে পিক আওয়ারের জরুরি বিদ্যুৎ এবং গ্রিড ফ্রিকোয়েন্সি নিয়ন্ত্রণে সহায়তাকারী পরিবেশবান্ধব জলবিদ্যুৎ কেন্দ্র।',
  'Key sustainability projects integrating utility-scale solar parks and coastal wind farms to reduce carbon footprint and fossil fuel dependency.': 'কার্বন নিঃসরণ ও জীবাশ্ম জ্বালানির ওপর নির্ভরতা কমানোর লক্ষ্যে বৃহৎ পরিসরের সৌরপার্ক ও উপকূলীয় বায়ুবিদ্যুৎ প্রকল্পসমূহ।',
  'A leading Independent Power Producer (IPP) contributing significantly to the national grid through high-efficiency combined cycle power plants.': 'উচ্চ-দক্ষতাসম্পন্ন কম্বাইন্ড সাইকেল পাওয়ার প্ল্যান্টের মাধ্যমে জাতীয় গ্রিডে উল্লেখযোগ্য অবদান রাখা অন্যতম শীর্ষ আইপিপি (IPP)।',
  'A diverse portfolio of private sector generation companies adding critical capacity and fostering market competition.': 'দেশের বিদ্যুৎ খাতে গুরুত্বপূর্ণ সক্ষমতা যোগ করা এবং বাজারে প্রতিযোগিতা বৃদ্ধিতে সহায়ক বিভিন্ন বেসরকারি উৎপাদনকারী প্রতিষ্ঠান।',
  'Quick-rental and rental power plants deployed to rapidly address short-term power deficits and stabilize regional supply.': 'স্বল্পমেয়াদী বিদ্যুতের ঘাটতি দ্রুত মেটাতে এবং আঞ্চলিক সরবরাহ স্থিতিশীল করতে স্থাপিত কুইক-রেন্টাল ও রেন্টাল বিদ্যুৎ কেন্দ্রসমূহ।',
  'A dedicated cross-border transmission link importing baseload coal power from the Adani Godda plant in India.': 'ভারতের আদানির গোড্ডা কেন্দ্র থেকে কয়লাভিত্তিক বেসলোড বিদ্যুৎ আমদানির জন্য একটি ডেডিকেটেড আন্তঃদেশীয় সঞ্চালন লাইন।',
  'A strategic cross-border interconnection importing clean hydroelectric power from Tripura, India, strengthening regional cooperation.': 'আঞ্চলিক সহযোগিতা জোরদার করতে ভারতের ত্রিপুরা থেকে পরিবেশবান্ধব জলবিদ্যুৎ আমদানির একটি কৌশলগত আন্তঃদেশীয় সংযোগ।',
  'The national oil company responsible for exploration, production, and distribution of natural gas and mineral resources.': 'প্রাকৃতিক গ্যাস ও খনিজ সম্পদের অনুসন্ধান, উৎপাদন এবং বিতরণের দায়িত্বে থাকা রাষ্ট্রীয় তেল ও গ্যাস কর্পোরেশন।',
  'Manages the importation, regasification, and integration of LNG to supplement declining domestic natural gas reserves.': 'দেশের কমতে থাকা প্রাকৃতিক গ্যাস রিজার্ভের পরিপূরক হিসেবে এলএনজি আমদানি, রিগ্যাসিফিকেশন এবং সরবরাহের ব্যবস্থাপনা করে।',
  'International supply chains ensuring the delivery of high-calorific-value coal for major baseload power plants.': 'প্রধান বেসলোড বিদ্যুৎ কেন্দ্রগুলোতে উচ্চ তাপমাত্রার কয়লা সরবরাহ নিশ্চিত করার আন্তর্জাতিক সাপ্লাই চেইন।',
  'A growing sector of decentralized and grid-tied renewable resources aiming to diversify the primary energy mix.': 'প্রাথমিক জ্বালানির মিশ্রণে বৈচিত্র্য আনতে বিকেন্দ্রীকৃত এবং গ্রিড-সংযুক্ত নবায়নযোগ্য জ্বালানির একটি ক্রমবর্ধমান খাত।',
  'The sole state-owned entity responsible for operating, maintaining, and expanding the national high-voltage transmission grid.': 'জাতীয় হাই-ভোল্টেজ সঞ্চালন গ্রিড পরিচালনা, রক্ষণাবেক্ষণ এবং সম্প্রসারণের একক দায়িত্বে থাকা রাষ্ট্রায়ত্ত প্রতিষ্ঠান।',
  'The central nervous system of the grid, balancing real-time supply and demand, and maintaining system frequency within safe limits.': 'জাতীয় গ্রিডের স্নায়ুকেন্দ্র; যা প্রতি মুহূর্তে বিদ্যুৎ সরবরাহ ও চাহিদার ভারসাম্য রক্ষা করে এবং সিস্টেম ফ্রিকোয়েন্সিকে নিরাপদ মাত্রায় ধরে রাখে।',
  'Manages the intricate power distribution network for the southern parts of the capital and adjacent highly industrialized areas.': 'ঢাকা দক্ষিণ ও তৎসংলগ্ন শিল্পাঞ্চলের ব্যাপক গ্রাহকগোষ্ঠীর কাছে বিদ্যুৎ পৌঁছে দিতে এক বিশাল ও জটিল বিতরণ নেটওয়ার্ক পরিচালনা করছে ডিপিডিসি।',
  'Delivers reliable electricity to the northern half of the capital, encompassing major commercial hubs and residential zones.': 'রাজধানীর উত্তরাংশের প্রধান বাণিজ্যিক কেন্দ্র ও আবাসিক এলাকাগুলোতে নিরবচ্ছিন্ন বিদ্যুৎ সরবরাহ নিশ্চিত করে আসছে ডেসকো।',
  'The largest distribution network in the country, electrifying thousands of villages through rural cooperatives.': 'পল্লী বিদ্যুতায়ন বোর্ডের অধীনে স্থানীয় সমবায় সমিতিগুলোর মাধ্যমে প্রত্যন্ত গ্রামগুলোতে আলো ছড়ানো দেশের সর্ববৃহৎ বিতরণ নেটওয়ার্ক।',
  'Ensures stable power supply to the Rajshahi and Rangpur divisions, supporting regional agricultural and industrial growth.': 'রাজশাহী ও রংপুর বিভাগে নিরবচ্ছিন্ন বিদ্যুৎ সরবরাহের মাধ্যমে বৃহত্তর উত্তরের কৃষি ও শিল্পায়নে মূল ভূমিকা রাখছে এই সংস্থা।',
  'Provides electricity to the Khulna and Barisal divisions, encompassing major ports and coastal economic zones.': 'মোংলা ও পায়রা বন্দরসহ খুলনা এবং বরিশাল বিভাগের সমগ্র উপকূলীয় অর্থনৈতিক অঞ্চলে বিদ্যুৎ সরবরাহের দায়িত্বে রয়েছে ওজোপাডিকো।',
  'High-demand industrial hubs driving the national economy, requiring uninterrupted and high-quality power supply.': 'জাতীয় অর্থনীতির মূল চালিকাশক্তি এসব বৃহৎ শিল্পাঞ্চলে উৎপাদন সচল রাখতে প্রয়োজন হয় সার্বক্ষণিক উচ্চমাত্রার নিরবচ্ছিন্ন বিদ্যুৎ।',
  'The urban commercial backbone, characterized by fluctuating daytime demand driven by commercial complexes and essential services.': 'শহুরে অর্থনীতির প্রাণকেন্দ্র; যেখানে মূলত বড় বড় মার্কেট, শপিং মল এবং কর্পোরেট অফিসের কারণে দিনের বেলা বিদ্যুতের ব্যাপক চাহিদা তৈরি হয়।',
  'Critical seasonal load driven by rural irrigation pumps ensuring national food security and agricultural productivity.': 'জাতীয় খাদ্য নিরাপত্তা এবং কৃষিজ উৎপাদনশীলতা নিশ্চিতকারী গ্রামীণ সেচ পাম্পগুলোর দ্বারা সৃষ্ট গুরুত্বপূর্ণ মৌসুমী লোড।',
  'The largest consumer base by volume, representing millions of households with a predominantly evening peak demand profile.': 'আয়তনের দিক থেকে সর্ববৃহৎ গ্রাহক গোষ্ঠী, যেখানে লক্ষ লক্ষ পরিবারের সান্ধ্যকালীন পিক আওয়ারের চাহিদাই প্রধান।',

  // Ticker Names & Units
  'Gold (22K BD)': 'স্বর্ণ (২২ ক্যারেট)',
  'BDT/Vori': '৳/ভরি',
  'USD/BDT (Live Rate)': 'ইউএসডি/টাকা (লাইভ রেট)',
  'BDT': 'টাকা',
  'EUR/BDT (Live Rate)': 'ইউরো/টাকা (লাইভ রেট)',
  'Crude Oil (WTI)': 'জ্বালানি তেল (WTI)',
  'Brent Oil': 'ব্রেন্ট ক্রুড',
  'bbl': 'ব্যারেল',
  '/ bbl': '/ ব্যারেল',
  'Natural Gas': 'প্রাকৃতিক গ্যাস',
  'Heating Oil': 'হিটিং অয়েল',
  'BTC/USD': 'বিটকয়েন (BTC)',
  'MMBtu': 'এমএমবিটিইউ',
  '/ MMBtu': '/ এমএমবিটিইউ',
  '/ gal': '/ গ্যালন',
  'Newcastle Coal': 'নিউক্যাসল কয়লা',
  'MT': 'মেট্রিক টন',
  'Hz': 'হার্জ (Hz)',

  // KPI Definitions
  'Definition': 'সংজ্ঞা',
  'Example': 'উদাহরণ',

  // Categories & Statuses
  'Government': 'সরকার',
  'Regulator': 'নিয়ন্ত্রক সংস্থা',
  'State Gen': 'সরকারি বিদ্যুৎ উৎপাদন',
  'Private Gen': 'বেসরকারি বিদ্যুৎ উৎপাদন',
  'Grid Transmission': 'বিদ্যুৎ সঞ্চালন',
  'Grid Distribution': 'বিদ্যুৎ বিতরণ',
  'Fuel Supply': 'জ্বালানি সরবরাহ',
  'Consumer': 'গ্রাহক পর্যায়',
  'State Generation': 'রাষ্ট্রায়ত্ত উৎপাদন',
  'Private IPPs & Rentals': 'বেসরকারি আইপিপি ও রেন্টাল',
  'Cross-Border Import': 'আন্তঃদেশীয় বিদ্যুৎ আমদানি',
  'Gas Production & E&P': 'গ্যাস উৎপাদন এবং ইএন্ডপি',
  'Gas Distribution Utilities': 'গ্যাস বিতরণ ইউটিলিটি',
  'normal': 'স্বাভাবিক',
  'alert': 'জরুরি অবস্থা',
  'warning': 'সতর্কতা',
  'Audited Record': 'নিরীক্ষিত রেকর্ড',

  // Electricity Tariff Panel
  'Electricity Tariff': 'বিদ্যুতের ট্যারিফ',
  'Tariff Rates': 'ট্যারিফ রেট',
  'All Customer Categories': 'সকল গ্রাহক শ্রেণি',
  'Official Data': 'সরকারি তথ্য',
  'Verified': 'যাচাইকৃত',
  'Last Verified': 'সর্বশেষ যাচাই',
  'Tariff effective per BERC Gazette': 'বিইআরসি গেজেট অনুযায়ী কার্যকর ট্যারিফ',
  'Residential': 'আবাসিক',
  'Commercial': 'বাণিজ্যিক',
  'Small Industry': 'ক্ষুদ্র শিল্প',
  'Medium Industry': 'মাঝারি শিল্প',
  'Large Industry': 'বৃহৎ শিল্প',
  'Agricultural (Irrigation)': 'কৃষি (সেচ)',
  'Street Lighting': 'সড়ক বাতি',
  'Religious & Charitable': 'ধর্মীয় ও দাতব্য',
  'Households and domestic meter connections': 'গৃহস্থালি ও আবাসিক মিটার সংযোগ',
  'Shops, offices, malls, and service sector': 'দোকান, অফিস, শপিংমল ও সেবা খাত',
  'Connected load up to 120 kW': 'সংযুক্ত লোড ১২০ কিলোওয়াট পর্যন্ত',
  'Connected load 120 kW – 5 MW': 'সংযুক্ত লোড ১২০ কিলোওয়াট থেকে ৫ মেগাওয়াট',
  'Connected load above 5 MW (132 kV+)': 'সংযুক্ত লোড ৫ মেগাওয়াটের ঊর্ধ্বে (১৩২ কেভি+)',
  'Municipal and city corporation street lights': 'পৌরসভা ও সিটি কর্পোরেশনের সড়ক বাতি',
  'Mosques, temples, churches, and charitable organizations': 'মসজিদ, মন্দির, গির্জা ও দাতব্য প্রতিষ্ঠান',
  'Slab / Tier': 'স্ল্যাব / ধাপ',
  'Energy Charge': 'এনার্জি চার্জ',
  'Demand Charge': 'ডিমান্ড চার্জ',
  '(starts)': '(শুরু)',
  'Flat Rate': 'ফ্ল্যাট রেট',
  'Peak Hours': 'পিক আওয়ার',
  'Off-Peak': 'অফ-পিক',
  '0–75 Unit': '০–৭৫ ইউনিট',
  '76–200 Unit': '৭৬–২০০ ইউনিট',
  '201–300 Unit': '২০১–৩০০ ইউনিট',
  '301–400 Unit': '৩০১–৪০০ ইউনিট',
  '401–600 Unit': '৪০১–৬০০ ইউনিট',
  '601+ Unit': '৬০১+ ইউনিট',
  'Minimum monthly charge': 'সর্বনিম্ন মাসিক চার্জ',
  'Reset View': 'ভিউ রিসেট',
  // Dynamically Added Translations
  'National policy oversight for energy sector. Overseen by Minister Iqbal Hassan Mahmood and MoS Anindya Islam Amit.': 'National policy oversight for energy sector. Overseen by Minister Iqbal Hassan Mahmood and MoS Anindya Islam Amit.',
  'Bangladesh Secretariat, Dhaka 1000': 'Bangladesh Secretariat, Dhaka 1000',
  'Nationwide': 'দেশব্যাপী',
  'Led by Sec. Ms. Farzana Mamtaz. Oversees generation, transmission, and distribution entities.': 'সচিব মিসেস ফারজানা মমতাজের নেতৃত্বে পরিচালিত। বিদ্যুৎ উৎপাদন, সঞ্চালন এবং বিতরণ সংস্থাগুলোর তদারকি করে।',
  'Bidyut Bhaban, Abdul Gani Road, Dhaka 1000': 'বিদ্যুৎ ভবন, আব্দুল গণি রোড, ঢাকা ১০০০',
  'Led by Sec. Mr. Mohammad Saiful Islam. Manages exploration, extraction, processing of fuels.': 'সচিব জনাব মোহাম্মদ সাইফুল ইসলামের নেতৃত্বে পরিচালিত। জ্বালানি অনুসন্ধান, উত্তোলন এবং প্রক্রিয়াজাতকরণ পরিচালনা করে।',
  'Regulates tariffs to insulate sector. Recently raised wholesale to Tk 8.39 and retail to Tk 10.63/kWh.': 'Regulates tariffs to insulate sector. Recently raised wholesale to Tk 8.39 and retail to Tk 10.63/kWh.',
  'TCB Bhaban, Karwan Bazar, Dhaka 1215': 'টিসিবি ভবন, কারওয়ান বাজার, ঢাকা ১২১৫',
  'Power Cell': 'পাওয়ার সেল',
  'Technical oversight and policy research.': 'প্রযুক্তিগত তদারকি এবং নীতি গবেষণা',
  'Bidyut Bhaban, Abdul Gani Road, Dhaka': 'বিদ্যুৎ ভবন, আব্দুল গণি রোড, ঢাকা',
  'R&D': 'গবেষণা ও উন্নয়ন',
  'Office of Chief Electric Inspector': 'প্রধান বিদ্যুৎ পরিদর্শকের দপ্তর',
  'Electric inspection.': 'বৈদ্যুতিক পরিদর্শন',
  '25, New Eskaton Road, Dhaka': '২৫, নিউ ইস্কাটন রোড, ঢাকা',
  'Energy & Power Research Council': 'এনার্জি অ্যান্ড পাওয়ার রিসার্চ কাউন্সিল',
  'Energy and power research.': 'এনার্জি and power research.',
  'Bidyut Bhaban, Dhaka': 'বিদ্যুৎ ভবন, ঢাকা',
  'SREDA': 'স্রেডা',
  'Promotes renewable energy transitions.': 'নবায়নযোগ্য জ্বালানিতে রূপান্তর প্রচার করে',
  'IEB Bhaban, Ramna, Dhaka': 'আইইবি ভবন, রমনা, ঢাকা',
  'Geological Survey of Bangladesh': 'বাংলাদেশ ভূতাত্ত্বিক জরিপ অধিদপ্তর',
  'Geological exploration.': 'ভূতাত্ত্বিক অনুসন্ধান',
  '153 Pioneer Road, Segunbagicha, Dhaka': '১৫৩ পাইওনিয়ার রোড, সেগুনবাগিচা, ঢাকা',
  'Technical': 'প্রযুক্তিগত',
  'Department of Explosives': 'বিস্ফোরক পরিদপ্তর',
  'Explosives management.': 'বিস্ফোরক ব্যবস্থাপনা',
  'Segunbagicha, Dhaka': 'সেগুনবাগিচা, ঢাকা',
  'Bureau of Mineral Development': 'খনিজ উন্নয়ন ব্যুরো',
  'Mineral development.': 'খনিজ উন্নয়ন',
  'Hydrocarbon Unit': 'হাইড্রোকার্বন ইউনিট',
  'Hydrocarbon research.': 'হাইড্রোকার্বন গবেষণা',
  'Petrocentre, Karwan Bazar, Dhaka': 'পেট্রোসেন্টার, কারওয়ান বাজার, ঢাকা',
  'Bangladesh Petroleum Institute': 'বাংলাদেশ পেট্রোলিয়াম ইনস্টিটিউট',
  'Petroleum training.': 'পেট্রোলিয়াম প্রশিক্ষণ',
  'Sector 8, Uttara, Dhaka': 'সেক্টর ৮, উত্তরা, ঢাকা',
  'BPDB': 'বাংলাদেশ বিদ্যুৎ উন্নয়ন বোর্ড (বিউবো)',
  'Central pillar of generation. Incurs catastrophic operating losses of BDT 39,590 crore, relying on subsidies.': 'বিদ্যুৎ উৎপাদনের মূল স্তম্ভ। বিপুল লোকসানের কারণে ৩৯,৫৯০ কোটি টাকার ভর্তুকির ওপর নির্ভরশীল।',
  'WAPDA Building, Motijheel C/A, Dhaka 1000': 'ওয়াপদা ভবন, মতিঝিল বা/এ, ঢাকা ১০০০',
  'Major urban and regional zones (Chattogram, Cumilla, Mymensingh, Sylhet)': 'প্রধান শহর এবং আঞ্চলিক এলাকা (চট্টগ্রাম, কুমিল্লা, ময়মনসিংহ, সিলেট)',
  'Single Buyer': 'একক ক্রেতা',
  'NWPGCL': 'নর্থ ওয়েস্ট পাওয়ার জেনারেশন কোম্পানি',
  'State-owned combined cycle and LNG plants.': 'রাষ্ট্রীয় মালিকানাধীন কম্বাইন্ড সাইকেল এবং এলএনজি প্ল্যান্ট।',
  'UTC Building, Panthapath, Dhaka': 'ইউটিসি ভবন, পান্থপথ, ঢাকা',
  'Northwestern Region (Sirajganj, Bheramara)': 'উত্তর-পশ্চিমাঞ্চল (সিরাজগঞ্জ, ভেড়ামারা)',
  'APSCL': 'আশুগঞ্জ পাওয়ার স্টেশন কোম্পানি',
  'Ashuganj gas-based power station complex.': 'আশুগঞ্জ গ্যাসভিত্তিক বিদ্যুৎ কেন্দ্র কমপ্লেক্স।',
  'Ashuganj, Brahmanbaria': 'আশুগঞ্জ, ব্রাহ্মণবাড়িয়া',
  'Ashuganj': 'আশুগঞ্জ',
  'Focusing on Siddhirganj and Haripur.': 'সিদ্ধিরগঞ্জ ও হরিপুরে কেন্দ্রীভূত।',
  'Unique Trade Centre, Panthapath, Dhaka': 'ইউনিক ট্রেড সেন্টার, পান্থপথ, ঢাকা',
  'Siddhirganj and Haripur': 'সিদ্ধিরগঞ্জ এবং হরিপুর',
  'Matarbari Power Plant': 'মাতারবাড়ি বিদ্যুৎ কেন্দ্র',
  'Ultra Super Critical Coal-Fired. Cheaper baseload power.': 'আল্ট্রা সুপার ক্রিটিক্যাল কয়লাভিত্তিক। সাশ্রয়ী বেসলোডের বিদ্যুৎ।',
  'Matarbari, Moheshkhali, Cox\'s Bazar': 'মাতারবাড়ি, মহেশখালী, কক্সবাজার',
  'Matarbari': 'মাতারবাড়ি',
  'Received 74.55 billion BDT in capacity charges, partly while idle.': 'Received 74.55 billion BDT in capacity charges, partly while idle.',
  'Payra, Patuakhali': 'পায়রা, পটুয়াখালী',
  'Payra': 'পায়রা',
  'Rampal Power Plant': 'Rampal পাওয়ার প্ল্যান্ট',
  'Bangladesh-India JV coal plant.': 'বাংলাদেশ-ভারত যৌথ উদ্যোগের কয়লা প্ল্যান্ট।',
  'Rampal, Bagerhat': 'রামপাল, বাগেরহাট',
  'Rampal': 'রামপাল',
  'Rooppur Nuclear Plant': 'রূপপুর পারমাণবিক বিদ্যুৎ কেন্দ্র',
  'Key state-owned generation facility managed by BPDB. Plays a critical role in base-load grid stability, utilizing modern dispatch protocols to balance national demand peaks.': 'বিউবো পরিচালিত রাষ্ট্রীয় মালিকানাধীন প্রধান উৎপাদন কেন্দ্র। আধুনিক ডেসপ্যাচ প্রোটোকল ব্যবহার করে জাতীয় চাহিদার ভারসাম্য বজায় রাখতে এবং বেস-লোড গ্রিড স্থিতিশীলতায় এটি গুরুত্বপূর্ণ ভূমিকা পালন করে।',
  'Rooppur, Ishwardi, Pabna': 'রূপপুর, ঈশ্বরদী, পাবনা',
  'Rooppur': 'রূপপুর',
  'Nuclear': 'পারমাণবিক',
  'Summit Group': 'সামিট গ্রুপ',
  'Dominant conglomerate. Received massive capacity charges.': 'শীর্ষস্থানীয় ব্যবসায়ী গ্রুপ। বিপুল ক্যাপাসিটি চার্জ গ্রহণ করেছে।',
  'Summit Centre, Kawran Bazar, Dhaka': 'সামিট সেন্টার, কারওয়ান বাজার, ঢাকা',
  'Meghnaghat, Bibiana, Madangonj, Khulna': 'মেঘনাঘাট, বিবিয়ানা, মদনগঞ্জ, খুলনা',
  'United Group': 'ইউনাইটেড গ্রুপ',
  'Independent Power Producer (IPP) supplying critical power to the national grid under long-term PPA with BPDB. Contributes to energy security with high-efficiency output.': 'বিউবো\'র সাথে দীর্ঘমেয়াদী চুক্তির অধীনে জাতীয় গ্রিডে বিদ্যুৎ সরবরাহকারী আইপিপি। উচ্চ-দক্ষতার মাধ্যমে এটি দেশের জ্বালানি নিরাপত্তায় অবদান রাখে।',
  'United House, Madani Avenue, Dhaka': 'ইউনাইটেড হাউস, মাদানি এভিনিউ, ঢাকা',
  'EPZs and National Grid': 'EPZs and National Grid',
  'Orion Group': 'ওরিয়ন গ্রুপ',
  'Orion House, Tejgaon I/A, Dhaka': 'ওরিয়ন হাউস, তেজগাঁও শিল্প এলাকা, ঢাকা',
  'National Grid': 'National Grid',
  'S. Alam Group': 'এস আলম গ্রুপ',
  'JV with SEPCO3 for Banshkhali coal plant.': 'বাঁশখালী কয়লা প্ল্যান্টের জন্য SEPCO3-এর সাথে যৌথ উদ্যোগ।',
  'S. Alam Bhaban, Asadganj, Chattogram': 'এস. আলম ভবন, আসাদগঞ্জ, চট্টগ্রাম',
  'Banshkhali': 'বাঁশখালী',
  'Meghna Power Ltd': 'মেঘনা পাওয়ার লিমিটেড',
  'Top recipient of IPP capacity charges.': 'আইপিপি ক্যাপাসিটি চার্জ গ্রহণের শীর্ষে।',
  'Meghnaghat, Narayanganj': 'মেঘনাঘাট, নারায়ণগঞ্জ',
  'Meghnaghat': 'মেঘনাঘাট',
  'Rural Power Co. Ltd': 'রুরাল পাওয়ার কোম্পানি লিমিটেড',
  'State-owned acting as IPP, extracting heavy charges.': 'রাষ্ট্রীয় মালিকানাধীন তবে আইপিপি হিসেবে কাজ করে এবং মোটা অঙ্কের চার্জ আদায় করে।',
  'House 19, Sector 1, Uttara, Dhaka': 'বাড়ি ১৯, সেক্টর ১, উত্তরা, ঢাকা',
  'Mymensingh, Gazipur': 'ময়মনসিংহ, গাজীপুর',
  'State IPP': 'রাষ্ট্রীয় আইপিপি',
  'Sembcorp NWPC Ltd': 'সেম্বকর্প এনডব্লিউপিসি লিমিটেড',
  'Sirajganj': 'সিরাজগঞ্জ',
  'APR Energy': 'এপিআর এনার্জি',
  'Pangaon, Keraniganj': 'পানগাঁও, কেরানীগঞ্জ',
  'Keraniganj': 'কেরানীগঞ্জ',
  'Haripur Power Ltd': 'হরিপুর পাওয়ার লিমিটেড',
  'Haripur, Narayanganj': 'Haripur, Narayanganj',
  'Haripur': 'হরিপুর',
  'United Ashuganj Energy': 'ইউনাইটেড আশুগঞ্জ এনার্জি',
  'Bangla Trac Power Unit-1': 'বাংলা ট্র্যাক পাওয়ার ইউনিট-১',
  'Banani, Dhaka': 'বনানী, ঢাকা',
  'Adani Godda': 'আদানি গোড্ডা',
  'Severe dispute over arrears, penalty charges, and inflated coal index.': 'বকেয়া, জরিমানা এবং কয়লার বর্ধিত দাম নিয়ে চরম বিবাদ।',
  'Godda, Jharkhand, India': 'গোড্ডা, ঝাড়খণ্ড, ভারত',
  'India to Bangladesh': 'ভারত থেকে বাংলাদেশ',
  'Cross-border': 'আন্তঃসীমান্ত',
  'Bheramara HVDC': 'ভেড়ামারা এইচভিডিসি',
  'India Import.': 'ভারত থেকে আমদানি',
  'Bheramara, Kushtia': 'ভেড়ামারা, কুষ্টিয়া',
  'India Interconnection': 'ভারত ইন্টারকানেকশন',
  'Aggreko International': 'অ্যাগ্রেকো ইন্টারন্যাশনাল',
  'Extracted massive rental payments over 14 years.': '১৪ বছরে বিপুল পরিমাণ রেন্টাল ভাড়া আদায় করেছে।',
  'UK Headquartered': 'যুক্তরাজ্য সদর দফতর',
  'Various short-term sites': 'বিভিন্ন স্বল্পমেয়াদী সাইট',
  'Rental Plant': 'রেন্টাল বিদ্যুৎ কেন্দ্র',
  'Khulna Power Co': 'খুলনা পাওয়ার কোম্পানি',
  'Khulna': 'খুলনা',
  'Summit Narayanganj': 'সামিট নারায়ণগঞ্জ',
  'Narayanganj': 'Narayanganj',
  'Dutch Bangla Power': 'Dutch Bangla পাওয়ার',
  'Acorn Infrastructure': 'অ্যাকর্ন ইনফ্রাস্ট্রাকচার',
  'Chattogram': 'Chattogram',
  'Desh Energy': 'দেশ এনার্জি',
  'Siddirganj Max Power': 'সিদ্ধিরগঞ্জ ম্যাক্স পাওয়ার',
  'Siddhirganj, Narayanganj': 'সিদ্ধিরগঞ্জ, নারায়ণগঞ্জ',
  'Siddhirganj': 'সিদ্ধিরগঞ্জ',
  'Monopolizes domestic gas. Power sector receives only 1050 MMCFD.': 'দেশীয় গ্যাসের একচেটিয়া নিয়ন্ত্রণকারী। বিদ্যুৎ খাত পায় মাত্র ১০৫০ এমএমসিএফডি।',
  'Petrocentre, 3 Kawran Bazar, Dhaka 1215': 'পেট্রোসেন্টার, ৩ কাওরান বাজার, ঢাকা ১২১৫',
  'BAPEX': 'বাপেক্স (বাংলাদেশ পেট্রোলিয়াম এক্সপ্লোরেশন)',
  'Domestic exploration.': 'দেশীয় অনুসন্ধান',
  'BAPEX Bhaban, Kawran Bazar, Dhaka': 'বাপেক্স ভবন, কাওরান বাজার, ঢাকা',
  'Domestic Gas Fields': 'দেশীয় গ্যাস ফিল্ড',
  'Gas Production': 'গ্যাস উৎপাদন',
  'BGFCL': 'বিজিএফসিএল',
  'Gas fields operation.': 'গ্যাস ফিল্ড পরিচালনা',
  'Birashar, Brahmanbaria': 'বিরাশার, ব্রাহ্মণবাড়িয়া',
  'Brahmanbaria Fields': 'ব্রাহ্মণবাড়িয়া ফিল্ডস',
  'SGFL': 'এসজিএফএল',
  'Sylhet gas fields.': 'সিলেট গ্যাস ফিল্ড',
  'Haripur, Sylhet': 'হরিপুর, সিলেট',
  'Sylhet Fields': 'সিলেট ফিল্ডস',
  'GTCL': 'জিটিসিএল',
  'High-pressure national transmission.': 'উচ্চ-চাপ জাতীয় সঞ্চালন',
  'GTCL Bhaban, Agargaon, Dhaka': 'জিটিসিএল ভবন, আগারগাঁও, ঢাকা',
  'National Transmission Network': 'জাতীয় সঞ্চালন নেটওয়ার্ক',
  'Gas Transmission': 'গ্যাস সঞ্চালন',
  'Titas Gas (TGTDPLC)': 'তিতাস গ্যাস (টিজিটিডিপিএলসি)',
  'Dhaka & industrial belts.': 'ঢাকা এবং শিল্পাঞ্চল',
  'Titas Gas Bhaban, Kawran Bazar, Dhaka': 'তিতাস গ্যাস ভবন, কাওরান বাজার, ঢাকা',
  'Greater Dhaka and surrounding industrial belts': 'বৃহত্তর ঢাকা এবং সংলগ্ন শিল্পাঞ্চল',
  'Gas Distribution': 'গ্যাস বিতরণ',
  'Bakhrabad Gas (BGDCL)': 'বাখরাবাদ গ্যাস (বিজিডিসিএল)',
  'Cumilla and Noakhali.': 'কুমিল্লা এবং নোয়াখালী',
  'Chapapur, Cumilla': 'চাপাপুর, কুমিল্লা',
  'Cumilla and Noakhali regions': 'কুমিল্লা এবং নোয়াখালী অঞ্চল',
  'Karnaphuli Gas (KGDCL)': 'কর্ণফুলী গ্যাস (কেজিডিসিএল)',
  'Chattogram region.': 'চট্টগ্রাম অঞ্চল',
  'Sholashahar, Chattogram': 'ষোলশহর, চট্টগ্রাম',
  'Chattogram region': 'চট্টগ্রাম অঞ্চল',
  'Jalalabad Gas (JGTDSL)': 'জালালাবাদ গ্যাস (জেজিটিডিএসএল)',
  'Sylhet region.': 'সিলেট অঞ্চল',
  'Gas Bhaban, Mendibagh, Sylhet': 'গ্যাস ভবন, মেন্ডিবাগ, সিলেট',
  'Sylhet region': 'সিলেট অঞ্চল',
  'Pashchimanchal Gas': 'পশ্চিমাঞ্চল গ্যাস',
  'Northwestern region.': 'উত্তর-পশ্চিমাঞ্চল',
  'Nalka, Sirajganj': 'নলকা, সিরাজগঞ্জ',
  'Northwestern regions': 'উত্তর-পশ্চিমাঞ্চল',
  'Sundarban Gas': 'সুন্দরবন গ্যাস',
  'Southwestern region.': 'দক্ষিণ-পশ্চিমাঞ্চল',
  'Boyra, Khulna': 'বয়রা, খুলনা',
  'Southwestern regions': 'দক্ষিণ-পশ্চিমাঞ্চল',
  'RPGCL (LNG)': 'আরপিজিসিএল (এলএনজি)',
  'Manages Moheshkhali FSRUs. Highly exposed to spot market volatility.': 'মহেশখালী এফএসআরইউ পরিচালনা করে। স্পট মার্কেটের অস্থিরতার প্রতি অত্যন্ত সংবেদনশীল।',
  'RPGCL Head Office, Nikunja-2, Dhaka': 'আরপিজিসিএল প্রধান কার্যালয়, নিকুঞ্জ-২, ঢাকা',
  'Moheshkhali Floating LNG Terminals': 'মহেশখালী ভাসমান এলএনজি টার্মিনাল',
  'Barapukuria Coal': 'বড়পুকুরিয়া কয়লা খনি',
  'Monopolized domestic coal mining.': 'দেশীয় কয়লা খনির একচেটিয়া নিয়ন্ত্রণ।',
  'Barapukuria, Parbatipur, Dinajpur': 'বড়পুকুরিয়া, পার্বতীপুর, দিনাজপুর',
  'Dinajpur': 'দিনাজপুর',
  'Coal Mining': 'কয়লা খনি',
  'BPC': 'বিপিসি',
  'Imports crude oil and refined petroleum.': 'অশোধিত তেল এবং পরিশোধিত পেট্রোলিয়াম আমদানি করে।',
  'BSCIC Building, Agrabad, Chattogram': 'বিসিক ভবন, আগ্রাবাদ, চট্টগ্রাম',
  'Eastern Refinery Ltd': 'Eastern Refinery Ltd',
  'Sole domestic crude refinery.': 'Sole domestic crude refinery.',
  'North Patenga, Chattogram': 'North Patenga, Chattogram',
  'Patenga': 'Patenga',
  'Refinery': 'Refinery',
  'Sole proprietor of high-voltage transmission. Base wheeling charge Tk 0.39/kWh.': 'Sole proprietor of high-voltage transmission. Base wheeling charge Tk 0.39/kWh.',
  'PGCB Bhaban, Aftabnagar, Dhaka': 'PGCB Bhaban, Aftabnagar, Dhaka',
  'NLDC': 'NLDC',
  'Balances supply and demand. Handled 16,221 MW max demand vs 26,815 MW capacity.': 'Balances supply and demand. Handled 16,221 MW max demand vs 26,815 MW capacity.',
  'Aftabnagar, Dhaka': 'আফতাবনগর, ঢাকা',
  'BREB': 'BREB',
  '80 PBSs, 36M connections. Highest consumer base.': '80 PBSs, 36M connections. Highest consumer base.',
  'Joar Sahara, Khilkhet, Dhaka': 'Joar Sahara, Khilkhet, Dhaka',
  '80 Palli Bidyut Samities connecting rural households': '80 Palli Bidyut Samities connecting rural households',
  'DPDC': 'DPDC',
  'Dhaka South. 1.77M consumers.': 'Dhaka South. 1.77M consumers.',
  'Central and southern corridors of Dhaka': 'Central and southern corridors of Dhaka',
  'DESCO': 'DESCO',
  'Dhaka North. 1.28M consumers.': 'Dhaka North. 1.28M consumers.',
  'Nikunja-2, Khilkhet, Dhaka': 'Nikunja-2, Khilkhet, Dhaka',
  'Northern zones of Dhaka, Mirpur, Gulshan, Tongi': 'Northern zones of Dhaka, Mirpur, Gulshan, Tongi',
  'NESCO': 'NESCO',
  'Rajshahi and Rangpur. 2.01M consumers.': 'Rajshahi and Rangpur. 2.01M consumers.',
  'Rajshahi': 'Rajshahi',
  'Rajshahi and Rangpur divisions': 'Rajshahi and Rangpur divisions',
  'WZPDCL': 'WZPDCL',
  'Khulna and Barisal. 1.59M consumers.': 'Khulna and Barisal. 1.59M consumers.',
  'Boyra Main Road, Khulna': 'Boyra Main Road, Khulna',
  'Khulna and Barisal divisions': 'Khulna and Barisal divisions',
  'RMG, textile, cement, steel, etc.': 'RMG, textile, cement, steel, etc.',
  'N/A': 'N/A',
  'Industrial Zones': 'Industrial Zones',
  'Shopping malls, hospitals, corporate hubs.': 'Shopping malls, hospitals, corporate hubs.',
  'Urban Centers': 'Urban Centers',
  'Irrigation pumps.': 'Irrigation pumps.',
  '45+ million households.': '45+ million households.',
  'State-owned power generation companies': 'State-owned power generation companies',
  'WAPDA Building, Dhaka': 'ওয়াপদা ভবন, ঢাকা',
  'Sector Coordinator': 'সেক্টর সমন্বয়কারী',
  'Independent Power Producers and Rentals': 'Independent পাওয়ার Producers and Rentals',
  'Various Locations': 'Various Locations',
  'Bilateral power purchase from cross-border entities': 'Bilateral power purchase from cross-border entities',
  'Cross-Border (India-BD)': 'Cross-Border (India-BD)',
  'National and international gas exploration and production': 'জাতীয় ও আন্তর্জাতিক গ্যাস অনুসন্ধান ও উৎপাদন',
  'Petrocenter, Dhaka': 'পেট্রোসেন্টার, ঢাকা',
  'Regional gas distribution utilities': 'আঞ্চলিক গ্যাস বিতরণ ইউটিলিটি',


  // Drill Panel UI
  'Institutional Fact Sheet': 'প্রাতিষ্ঠানিক তথ্য বিবরণী',
  'Status': 'অবস্থা',
  'Headquarters': 'সদর দপ্তর',
  'Operating Jurisdiction': 'পরিচালন এলাকা',
  'Official Portal': 'অফিসিয়াল পোর্টাল',
  'Data Source': 'তথ্য সূত্র',
  'MoPEMR': 'বিদ্যুৎ, জ্বালানি ও খনিজ সম্পদ মন্ত্রণালয়',
  'BPDB Database': 'পিডিবি ডাটাবেস',
  'State-owned power generation companies': 'রাষ্ট্রীয় মালিকানাধীন বিদ্যুৎ উৎপাদন কোম্পানিগুলো',
  'WAPDA Building, Dhaka': 'ওয়াপদা ভবন, ঢাকা',
  'normal': 'স্বাভাবিক',
  'warning': 'সতর্কতা',
  'alert': 'সঙ্কটাপন্ন',

};

const enToBnDigits = (numStr: string) => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return numStr.replace(/[0-9]/g, (w) => bnDigits[parseInt(w, 10)]);
};

export const UNIT_EXPLANATIONS: Record<string, { defEn: string, defBn: string, exEn: string, exBn: string }> = {
  'MW Capacity': {
    defEn: 'MW (Megawatt) Capacity is the maximum power generation limit of a power plant under ideal conditions.',
    defBn: 'একটি বিদ্যুৎ কেন্দ্রের পূর্ণ সক্ষমতায় উৎপাদনের সর্বোচ্চ সীমাই হলো এর মেগাওয়াট (MW) ক্যাপাসিটি। কেন্দ্রটি সর্বোচ্চ কতটুকু বিদ্যুৎ গ্রিডে দিতে পারবে, তা এটি দিয়ে বোঝানো হয়।',
    exEn: '1 kW can power a few household appliances. 1 MW (1,000 kW) can continuously supply electricity to around 1,000 standard homes.',
    exBn: '১ কিলোওয়াট (kW) বিদ্যুৎ দিয়ে একটি মাঝারি সাইজের এসিসহ কয়েকটি ফ্যান-বাতি চালানো যায়। আর ১ মেগাওয়াট (MW) অর্থাৎ ১,০০০ কিলোওয়াট দিয়ে একসাথে প্রায় ১ হাজার সাধারণ পরিবারে নিরবচ্ছিন্ন বিদ্যুৎ সরবরাহ সম্ভব।'
  },
  'MW Supervised': {
    defEn: 'Supervised MW indicates the total power generation capacity managed or regulated by a specific authority.',
    defBn: 'তদারকিকৃত মেগাওয়াট (MW) বলতে একটি নির্দিষ্ট সংস্থা বা কর্তৃপক্ষের অধীনে পরিচালিত মোট বিদ্যুৎ উৎপাদন ক্ষমতাকে বোঝায়।',
    exEn: 'If an authority supervises 10,000 MW, they manage power equivalent to supplying 10 million homes simultaneously.',
    exBn: 'উদাহরণস্বরূপ, কোনো কর্তৃপক্ষ যদি ১০,০০০ মেগাওয়াট ক্ষমতা তদারকি করে, এর মানে তারা এমন পরিমাণ বিদ্যুৎ নিয়ন্ত্রণ করছে যা দিয়ে প্রায় ১ কোটি পরিবারের চাহিদা মেটানো সম্ভব।'
  },
  'Tariff Changes/Year': {
    defEn: 'The frequency at which electricity tariff rates are adjusted within a calendar year.',
    defBn: 'বছরে কতবার বিদ্যুতের পাইকারি বা খুচরা মূল্য সমন্বয় করা হয়, তা এই সূচকের মাধ্যমে প্রকাশ করা হয়।',
    exEn: 'A change of even 1 cent per unit can translate to millions of dollars in overall national expenditure.',
    exBn: 'বিদ্যুতের দাম প্রতি ইউনিটে মাত্র ১ টাকা বাড়লেও দেশব্যাপী গ্রাহকদের ওপর বছরে কয়েক হাজার কোটি টাকার অতিরিক্ত ব্যয়ের চাপ সৃষ্টি হয়।'
  },
  'MW (Approx)': {
    defEn: 'Approximate MW is the estimated maximum power generation of a facility.',
    defBn: 'আনুমানিক মেগাওয়াট (MW) হলো কোনো কেন্দ্রের সম্ভাব্য সর্বোচ্চ বিদ্যুৎ উৎপাদনের হিসাব, যা পারিপার্শ্বিক অবস্থার ওপর ভিত্তি করে বদলাতে পারে।',
    exEn: 'A 200 MW (Approx) facility can generally light up a mid-sized town, accounting for minor efficiency losses.',
    exBn: 'যেমন, ২০০ মেগাওয়াট (প্রায়) ক্ষমতার একটি কেন্দ্র স্বাভাবিক অবস্থায় একটি মাঝারি আকারের শহরের সম্পূর্ণ বিদ্যুতের চাহিদা মেটাতে সক্ষম।'
  },
  'Total MW': {
    defEn: 'Total MW represents the complete generation capacity installed across the entire national grid.',
    defBn: 'জাতীয় গ্রিডে সংযুক্ত দেশের সকল বিদ্যুৎ কেন্দ্রের সম্মিলিত উৎপাদন ক্ষমতাকে মোট মেগাওয়াট (Total MW) বলা হয়।',
    exEn: 'If the total is 25,000 MW, it implies the nation can power 25 million homes if all plants operate optimally.',
    exBn: 'দেশের মোট মেগাওয়াট যদি ২৫,০০০ হয়, তবে সব কেন্দ্র পূর্ণ ক্ষমতায় চললে তা দিয়ে প্রায় আড়াই কোটি ঘরে নিরবচ্ছিন্ন বিদ্যুৎ দেওয়া সম্ভব।'
  },
  'Billion Cubic Feet': {
    defEn: 'Billion Cubic Feet (BCF) is a massive scale used to measure national natural gas reserves and large-scale usage.',
    defBn: 'বিলিয়ন ঘনফুট (BCF) হলো প্রাকৃতিক গ্যাস মজুত এবং ব্যবহারের একটি বৃহৎ একক, যা সাধারণত জাতীয় গ্যাসক্ষেত্রের মজুত বোঝাতে ব্যবহৃত হয়।',
    exEn: 'While 1 cubic foot of gas can boil some water, 1 BCF can fuel a major 100 MW power plant for several weeks.',
    exBn: '১ ঘনফুট গ্যাস দিয়ে যেখানে চুলায় এক হাঁড়ি পানি গরম করা যায়, সেখানে ১ বিলিয়ন ঘনফুট গ্যাস দিয়ে ১০০ মেগাওয়াটের একটি বড় বিদ্যুৎ কেন্দ্র কয়েক সপ্তাহ একটানা চালানো যায়।'
  },
  'MMcf/d': {
    defEn: 'Million Standard Cubic Feet per Day (MMcf/d) measures the daily flow of natural gas into the grid.',
    defBn: 'এমএমসিএফডি (MMcf/d) হলো দৈনিক মিলিয়ন ঘনফুট গ্যাস সরবরাহের হিসাব, যা জাতীয় গ্রিডে গ্যাসের প্রবাহ মাপতে ব্যবহৃত হয়।',
    exEn: 'A supply of 150 MMcf/d is typically required to keep a massive 1,000 MW power plant running efficiently.',
    exBn: '১,০০০ মেগাওয়াট ক্ষমতার একটি বড় গ্যাসভিত্তিক বিদ্যুৎ কেন্দ্র সচল রাখতে প্রতিদিন প্রায় ১৫০ এমএমসিএফডি গ্যাস পোড়াতে হয়।'
  },
  'Grid Substations': {
    defEn: 'Substations step-down high-voltage electricity from power plants to safe levels for local distribution.',
    defBn: 'গ্রিড সাবস্টেশন হলো এমন একটি অতিগুরুত্বপূর্ণ স্থাপনা, যেখানে সঞ্চালন লাইন থেকে আসা উচ্চ ভোল্টেজের বিদ্যুৎকে কমিয়ে বিতরণ লাইনের উপযোগী করা হয়।',
    exEn: 'High-voltage lines carry power at 400kV over long distances, which substations then step down to 220V for household outlets.',
    exBn: 'বিদ্যুৎ কেন্দ্র থেকে ৪০০ কেভি (kV) অতি-উচ্চ ভোল্টেজে আসা বিদ্যুৎ এই সাবস্টেশনের মাধ্যমেই ধাপে ধাপে কমিয়ে বাসাবাড়ির জন্য নিরাপদ ২২০ ভোল্টে নামিয়ে আনা হয়।'
  },
  'km Lines': {
    defEn: 'Kilometers of Lines refers to the total length of the power transmission network spanning the country.',
    defBn: 'কিলোমিটার লাইন (km Lines) বলতে জাতীয় গ্রিডের সঞ্চালন ও বিতরণ লাইনের মোট দৈর্ঘ্যকে বোঝায়, যা দেশের এক প্রান্ত থেকে অন্য প্রান্তে বিদ্যুৎ বহন করে।',
    exEn: 'A 1,000 km network is roughly the distance required to cross the entire country multiple times.',
    exBn: '১,০০০ কিমি সঞ্চালন লাইন দিয়ে বাংলাদেশের এক প্রান্ত থেকে অন্য প্রান্ত পর্যন্ত একাধিকবার সংযোগ স্থাপন করা সম্ভব।'
  },
  'Million Consumers': {
    defEn: 'One million consumers refers to 1,000,000 active utility connections across all sectors.',
    defBn: '১ মিলিয়ন বা ১০ লাখ গ্রাহক বলতে আবাসিক, বাণিজ্যিক এবং শিল্প খাতের ১০ লাখ সক্রিয় বিদ্যুৎ সংযোগকে বোঝায়।',
    exEn: 'Since each connection usually represents a household, 1 million connections serve about 4 to 5 million people.',
    exBn: 'যেহেতু একটি সংযোগ সাধারণত একটি পুরো পরিবারের চাহিদা মেটায়, তাই ১ মিলিয়ন গ্রাহক মানে প্রায় ৪০ থেকে ৫০ লাখ মানুষের দোরগোড়ায় বিদ্যুৎ সুবিধা পৌঁছে দেওয়া।'
  },
  'Lakh Consumers': {
    defEn: 'One Lakh consumers represents 100,000 active connections within a specific distribution area.',
    defBn: '১ লাখ গ্রাহক বলতে নির্দিষ্ট একটি বিতরণ এলাকার অধীনস্থ ১ লাখ সক্রিয় আবাসিক বা বাণিজ্যিক বিদ্যুৎ সংযোগকে বোঝায়।',
    exEn: '10 Lakh (1 Million) households receiving power directly benefits around 4 to 5 million individuals.',
    exBn: '১০ লাখ গ্রাহকের কাছে নিরবচ্ছিন্ন বিদ্যুৎ পৌঁছানোর অর্থ হলো দেশের প্রায় ৪০ থেকে ৫০ লাখ মানুষের দৈনন্দিন জীবনযাত্রা ও অর্থনীতি সচল রাখা।'
  },
  'Million Tonnes/Year': {
    defEn: 'Millions of Tonnes per Year indicates the annual consumption of heavy solid fuels like coal.',
    defBn: 'বার্ষিক মিলিয়ন টন হলো ভারী জ্বালানি (যেমন: কয়লা) ব্যবহারের একটি বৃহৎ মাপকাঠি। ১ মিলিয়ন টন মানে ১০ লাখ মেট্রিক টন।',
    exEn: 'A 1,320 MW mega power plant can burn through upwards of 4 million tonnes of coal annually.',
    exBn: 'উদাহরণস্বরূপ, ১,৩২০ মেগাওয়াটের একটি মেগা কয়লাভিত্তিক বিদ্যুৎ কেন্দ্রকে সারা বছর সচল রাখতে প্রায় ৪০ লাখ মেট্রিক টন কয়লা পোড়াতে হয়।'
  },
  'MW Demand': {
    defEn: 'Megawatt Demand reflects the instant, cumulative electricity requirement of all consumers nationwide.',
    defBn: 'মেগাওয়াট চাহিদা বলতে একটি নির্দিষ্ট মুহূর্তে সারা দেশের সব গ্রাহকের সম্মিলিত বিদ্যুতের প্রয়োজনকে বোঝায়।',
    exEn: 'A sudden heatwave can spike MW Demand by hundreds of megawatts as millions turn on air conditioners.',
    exBn: 'তীব্র তাপপ্রবাহের সময় লাখ লাখ গ্রাহক একসাথে এসি ও ফ্যান চালু করায় সারা দেশে বিদ্যুতের মেগাওয়াট চাহিদা কয়েক হাজার মেগাওয়াট পর্যন্ত বেড়ে যায়।'
  },
  'MW Peak': {
    defEn: 'MW Peak is the absolute highest electricity demand recorded during the busiest hours of the day.',
    defBn: 'সর্বোচ্চ মেগাওয়াট (MW Peak) হলো দিনের সবচেয়ে ব্যস্ত সময়ে (সাধারণত সন্ধ্যায়) সারা দেশে বিদ্যুতের সর্বোচ্চ চাহিদার রেকর্ড।',
    exEn: 'If evening peak hits 15,000 MW, grid operators must ensure exactly 15,000 MW is generated to avoid blackouts.',
    exBn: 'সন্ধ্যার পিক আওয়ারে চাহিদা যদি ১৫,০০০ মেগাওয়াট হয়, তবে লোডশেডিং এড়াতে ওই মুহূর্তে ঠিক ১৫,০০০ মেগাওয়াট বিদ্যুৎই গ্রিডে সরবরাহ করতে হয়।'
  },
  'MW Target': {
    defEn: 'MW Target outlines the strategic capacity goals set by the government for future power generation.',
    defBn: 'মেগাওয়াট লক্ষ্যমাত্রা হলো বিদ্যুৎ খাতকে এগিয়ে নিতে সরকারের ভবিষ্যৎ উৎপাদন সক্ষমতা বৃদ্ধির দীর্ঘমেয়াদি পরিকল্পনা।',
    exEn: 'A target of adding 4,000 MW of renewables means replacing the energy equivalent of four massive coal plants.',
    exBn: 'যেমন, নবায়নযোগ্য জ্বালানিতে ৪,০০০ মেগাওয়াটের লক্ষ্যমাত্রা নির্ধারণের মানে হলো, ভবিষ্যৎ প্রজন্মের জন্য ৪টি বিশাল কয়লা বিদ্যুৎ কেন্দ্রের সমপরিমাণ পরিচ্ছন্ন জ্বালানি নিশ্চিত করা।'
  },
  'MW Real-time': {
    defEn: 'Real-time MW displays the live, second-by-second volume of electricity currently flowing through the national grid.',
    defBn: 'রিয়েল-টাইম মেগাওয়াট (MW) হলো ঠিক এই মুহূর্তে জাতীয় গ্রিডে প্রবাহিত হওয়া বিদ্যুতের একদম সঠিক পরিমাণ।',
    exEn: 'Monitoring real-time MW allows engineers to balance supply and demand instantly to prevent grid failure.',
    exBn: 'গ্রিড মনিটরে যদি রিয়েল-টাইম ১৩,৫০০ মেগাওয়াট দেখায়, তবে বুঝতে হবে দেশের পাওয়ার প্ল্যান্টগুলো ঠিক এই মুহূর্তেই ওই পরিমাণ বিদ্যুৎ উৎপাদন করে গ্রিডে পুশ করছে।'
  },
  'Circuit KM': {
    defEn: 'Circuit Kilometers measures the length of transmission lines multiplied by the number of individual circuits they carry.',
    defBn: 'সার্কিট কিলোমিটার বলতে শুধু তারের দৈর্ঘ্য নয়, বরং সঞ্চালন লাইনে কয়টি সার্কিট রয়েছে তা হিসাব করে লাইনের মোট দৈর্ঘ্যকে বোঝায়।',
    exEn: 'A 100 km physical tower line carrying double circuits equates to 200 Circuit KM of actual power capacity.',
    exBn: 'অর্থাৎ ১০০ কিলোমিটার দীর্ঘ একটি টাওয়ার লাইনে যদি ডাবল-সার্কিট (দুটি আলাদা লাইন) থাকে, তবে গ্রিডের হিসাবে সেটি ২০০ সার্কিট কিলোমিটার লাইন হিসেবে গণ্য হয়।'
  },
  'MMcfd Gas': {
    defEn: 'Million Cubic Feet per Day (MMcfd) indicates the volume of natural gas pumped into the supply network daily.',
    defBn: 'এমএমসিএফডি (MMcfd) গ্যাস বলতে দৈনিক জাতীয় গ্যাস গ্রিডে সরবরাহ করা প্রাকৃতিক গ্যাসের মোট পরিমাণকে বোঝায়।',
    exEn: 'Injecting 500 MMcfd of gas into the system is substantial enough to operate several large-scale power stations.',
    exBn: 'দৈনিক ৫০০ এমএমসিএফডি গ্যাস সরবরাহ করার অর্থ হলো এটি দিয়ে কয়েকটি বড় আকারের বিদ্যুৎ কেন্দ্র অনায়াসে সারা দিন চালানো সম্ভব।'
  },
  'MMTPA': {
    defEn: 'Million Metric Tonnes Per Annum (MMTPA) measures the massive yearly import capacity of LNG terminals.',
    defBn: 'এমএমটিপিএ (MMTPA) হলো এলএনজি (LNG) টার্মিনালের মাধ্যমে বছরে আমদানি করা তরলীকৃত গ্যাসের পরিমাণ মাপার একক।',
    exEn: 'A 7.5 MMTPA floating terminal can process and supply 7.5 million tonnes of gas every year to the national grid.',
    exBn: '৭.৫ এমএমটিপিএ ক্ষমতার একটি এলএনজি টার্মিনাল মানে হলো, এটি সমুদ্রপথে আসা জাহাজ থেকে বছরে সাড়ে ৭ লাখ টন তরল গ্যাস রিগ্যাসিফাই করে জাতীয় গ্রিডে দিতে পারে।'
  }
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('BN'); // Default to Bangladesh
  const [currency, setCurrency] = useState<'BDT' | 'USD'>('BDT');
  const [exchangeRate, setExchangeRate] = useState<number>(117.5);

  useEffect(() => {
    // Detect IP location to set the language on initial load
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.country_code && data.country_code !== 'BD') {
          setLanguage('EN'); // Show US/EN if not from Bangladesh
          setCurrency('USD'); // Default to USD if outside BD
        }
      })
      .catch(err => {
        console.warn('IP location fetch failed, defaulting to BN:', err);
      });

    // Fetch Live Exchange Rate from our API
    fetch('/api/market-data')
      .then(res => res.json())
      .then(data => {
        const bdtRate = data.find((item: any) => item.id === 'BDT=X');
        if (bdtRate && bdtRate.price) {
          setExchangeRate(bdtRate.price);
        }
      })
      .catch(console.error);
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'EN' ? 'BN' : 'EN'));
  };

  const toggleCurrency = () => {
    setCurrency(prev => (prev === 'BDT' ? 'USD' : 'BDT'));
  };

  const t = (key: string): string => {
    if (language === 'EN') return key;
    return DICTIONARY[key] || key;
  };

  const formatNum = (num: number, maxFractions: number = 2): string => {
    let str = num.toLocaleString(language === 'BN' ? 'en-IN' : 'en-US', { maximumFractionDigits: maxFractions });
    if (language === 'BN') {
      return enToBnDigits(str);
    }
    return str;
  };

  const formatCurrency = (num: number, forceCurrency?: 'BDT' | 'USD'): string => {
    // If language is EN, default to USD behavior unless forced to BDT
    const activeCurrency = forceCurrency || (language === 'EN' ? 'USD' : 'BDT');
    
    if (activeCurrency === 'USD') {
      if (language === 'EN') {
        if (num >= 1e9) return (num / 1e9).toFixed(2) + ' B USD';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + ' M USD';
        return num.toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' USD';
      } else {
        if (num >= 1e9) return enToBnDigits((num / 1e9).toFixed(2)) + ' বিলিয়ন ইউএসডি';
        if (num >= 1e6) return enToBnDigits((num / 1e6).toFixed(2)) + ' মিলিয়ন ইউএসডি';
        return enToBnDigits(num.toLocaleString('en-US', { maximumFractionDigits: 2 })) + ' ইউএসডি';
      }
    }

    // BDT Formatting - ALWAYS use Crore (1e7) and Lakh (1e5)
    if (language === 'EN') {
      if (num >= 1e7) return (num / 1e7).toFixed(2) + ' Cr BDT';
      if (num >= 1e5) return (num / 1e5).toFixed(2) + ' Lakh BDT';
      return num.toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' BDT';
    } else {
      if (num >= 1e7) return enToBnDigits((num / 1e7).toFixed(2)) + ' কোটি টাকা';
      if (num >= 1e5) return enToBnDigits((num / 1e5).toFixed(2)) + ' লাখ টাকা';
      return enToBnDigits(num.toLocaleString('en-US', { maximumFractionDigits: 2 })) + ' টাকা';
    }
  };

  const translateKpi = (value: string | number | undefined, unit: string | undefined): { value: string; unit: string } => {
    if (!value) return { value: '—', unit: t(unit || '') };
    let numVal = typeof value === 'number' ? value : Number(value);
    
    if (language === 'EN') {
      // Dynamic conversion from BDT to USD for KPI Blocks in US mode
      if (unit && (unit.includes('Cr BDT Charge') || unit.includes('Cr BDT Loss') || unit.includes('Cr BDT Budget'))) {
        if (!isNaN(numVal)) {
          // Input value is in Crores of BDT. So actual BDT = numVal * 1e7
          const actualBDT = numVal * 1e7;
          const actualUSD = actualBDT / exchangeRate;
          
          if (actualUSD >= 1e9) {
            numVal = actualUSD / 1e9;
            unit = unit.replace('Cr BDT', 'B USD');
          } else {
            numVal = actualUSD / 1e6;
            unit = unit.replace('Cr BDT', 'M USD');
          }
        }
      }
    }

    if (language === 'BN' && unit === 'Million Tonnes/Year' && !isNaN(numVal)) {
      return { value: formatNum(numVal / 10), unit: 'কোটি টন/বছর' };
    }
    
    return { 
      value: isNaN(numVal) ? t(String(value)) : formatNum(numVal), 
      unit: t(unit || '') 
    };
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, currency, toggleCurrency, exchangeRate, t, formatNum, formatCurrency, translateKpi }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
