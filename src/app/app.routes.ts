import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: "Baseline Health | Rapid, Reliable Refills for Your Mental Health Meds",
    data: { description: "Asynchronous telepsychiatry for stable patients. Get your mental health medication refills without the time-consuming follow-up visits." },
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'about',
    title: "About Us | Baseline Health",
    data: { description: "Baseline Health was created by a Board-Certified Psychiatrist to offer fast, convenient and cost-effective asynchronous telepsychiatry for medication refills." },
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },
  {
    path: 'how-it-works',
    title: "How It Works | Baseline Health",
    data: { description: "How Baseline Health works: complete an assessment, add your medications, upload proof of stability, choose a membership and receive refills at your pharmacy." },
    loadComponent: () => import('./pages/how-it-works/how-it-works').then((m) => m.HowItWorks),
  },
  {
    path: 'what-we-treat',
    title: "What We Treat | Baseline Health",
    data: { description: "Baseline Health provides medication refills for depression, anxiety disorders, panic disorder, OCD, PTSD, ADHD, insomnia and more." },
    loadComponent: () => import('./pages/what-we-treat/what-we-treat').then((m) => m.WhatWeTreat),
  },
  {
    path: 'medications',
    title: "Medications We Offer | Baseline Health",
    data: { description: "Baseline Health offers refills for 17 cost-effective generic mental health medications with low side-effect profiles and no required lab monitoring." },
    loadComponent: () => import('./pages/medications/medications').then((m) => m.Medications),
  },
  {
    path: 'faqs',
    title: "FAQs for Patients | Baseline Health",
    data: { description: "Answers to common questions about Baseline Health: costs, privacy, eligibility, medications, and the states we serve." },
    loadComponent: () => import('./pages/faqs/faqs').then((m) => m.Faqs),
  },
  { path: '**', redirectTo: '' },
];
