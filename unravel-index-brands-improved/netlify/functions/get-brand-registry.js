'use strict';

/**
 * Optional governed identity source for the assessment. If registry table
 * variables are not configured the questionnaire remains usable and asks the
 * respondent for the ontology. When configured, a verified record can prefill
 * the same fields without changing any score.
 */

const { findOne, list, esc } = require('../../lib/airtable');
const { ok, badRequest, unauthorized, tooMany, serverError, preflight, rateLimit, clientKey } = require('../../lib/http');

const T_PARTNERS=process.env.AIRTABLE_PARTNERS_TABLE;
const T_BRANDS=process.env.AIRTABLE_BRANDS_TABLE;
const T_LINES=process.env.AIRTABLE_COMMERCIAL_LINES_TABLE;

exports.handler=async(event)=>{
  if(event.httpMethod==='OPTIONS') return preflight();
  if(event.httpMethod!=='GET') return badRequest('Use GET.');
  if(!rateLimit(`registry:${clientKey(event)}`,{limit:20,windowMs:60_000})) return tooMany();
  const code=String(((event.queryStringParameters||{}).code)||'').trim();
  if(!code) return badRequest('No access code supplied.');
  try{
    const partner=await findOne(T_PARTNERS,'PartnerCode',code);
    if(!partner||partner.fields.Active!==true) return unauthorized('That access code is not active.');
    if(!T_BRANDS||!T_LINES) return ok({available:false,brands:[],message:'The governed brand registry is not configured for this deployment.'});
    const formula=`{PartnerCode} = '${esc(code)}'`;
    const [brandRecords,lineRecords]=await Promise.all([list(T_BRANDS,{formula}),list(T_LINES,{formula})]);
    const linesByBrand={};
    lineRecords.forEach(r=>{
      const f=r.fields||{}, brandId=cleanId(f.BrandID), lineId=cleanId(f.LineID);
      if(!brandId||!lineId||!f.Name) return;
      (linesByBrand[brandId]=linesByBrand[brandId]||[]).push({
        lineId,name:text(f.Name,80),offeringType:text(f.OfferingType,60),operatingModel:text(f.OperatingModel,60),
        commercialStatus:text(f.CommercialStatus,40),territory:text(f.Territory,120),partner:text(f.Partner,120),
        channel:text(f.Channel,120),share:text(f.IncomeShare,40),licensees:text(f.LicenseeCount,20),renewal:text(f.Renewal,40),
        sourceLabel:text(f.Source,160),sourceUrl:url(f.SourceURL),verificationStatus:text(f.VerificationStatus,40),verifiedAt:date(f.VerifiedAt),
      });
    });
    const brands=brandRecords.map(r=>{
      const f=r.fields||{}, brandId=cleanId(f.BrandID);
      if(!brandId||!f.CanonicalName) return null;
      return {
        brandId,canonicalName:text(f.CanonicalName,120),brandFamily:text(f.BrandFamily,120),platform:text(f.Platform,80),
        portfolioStatus:text(f.PortfolioStatus,40),relationshipToPortfolio:text(f.RelationshipToPortfolio,60),
        primaryTerritories:text(f.PrimaryTerritories,160),registrySource:text(f.RegistrySource,160),registrySourceUrl:url(f.SourceURL),
        registryVerificationStatus:text(f.VerificationStatus,40),registryVerifiedAt:date(f.VerifiedAt),
        lines:linesByBrand[brandId]||[],
      };
    }).filter(Boolean).sort((a,b)=>a.canonicalName.localeCompare(b.canonicalName));
    return ok({available:true,ontologyVersion:'unravel-brand-ontology-v1.0',brands});
  }catch(err){return serverError(err,'get-brand-registry','read');}
};

function text(v,max){return v==null?'':String(v).trim().slice(0,max);}
function cleanId(v){const s=text(v,80).toUpperCase();return /^[A-Z0-9][A-Z0-9_-]{2,79}$/.test(s)?s:'';}
function url(v){const s=text(v,500);return /^https:\/\//i.test(s)?s:'';}
function date(v){const s=text(v,20);return /^\d{4}-\d{2}-\d{2}/.test(s)?s.slice(0,10):'';}

