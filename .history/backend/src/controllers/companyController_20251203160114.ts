import { Request, Response } from 'express';
import companyApiService from '../services/companyApiService';

/**
 * GET /api/companies
 * Get all companies from Driver API
 */
export const getAllCompanies = async (_req: Request, res: Response) => {
  try {
    const companies = await companyApiService.fetchAllCompanies();
    
    if (!companies) {
      return res.status(503).json({
        success: false,
        message: 'Unable to fetch company data from external API',
        count: 0,
        data: []
      });
    }
    
    return res.json({
      success: true,
      count: companies.length,
      data: companies
    });
  } catch (error) {
    console.error('❌ Error in getAllCompanies:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting companies',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/companies/:companyId
 * Get specific company by ID
 */
export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required'
      });
    }

    const company = await companyApiService.fetchCompanyById(companyId);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: `Company not found with ID: ${companyId}`,
        data: null
      });
    }
    
    return res.json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('❌ Error in getCompanyById:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting company',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/companies/by-user/:accuserkey
 * Get company information for a specific user
 */
export const getCompanyByUserId = async (req: Request, res: Response) => {
  try {
    const { accuserkey } = req.params;

    if (!accuserkey) {
      return res.status(400).json({
        success: false,
        message: 'User accuserkey is required'
      });
    }

    console.log(`📡 GET /api/companies/by-user/${accuserkey} - Starting...`);
    
    const company = await companyApiService.fetchCompanyByUserId(accuserkey);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: `No company found for user: ${accuserkey}`,
        data: null
      });
    }
    
    console.log(`✅ Found company ${company.id} for user ${accuserkey}`);
    
    return res.json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('❌ Error in getCompanyByUserId:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting company for user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * POST /api/companies/refresh
 * Refresh company cache
 */
export const refreshCompanies = async (_req: Request, res: Response) => {
  try {
    // Clear cache
    companyApiService.clearCache();
    
    // Fetch fresh data
    const companies = await companyApiService.fetchAllCompanies();
    
    return res.json({
      success: true,
      message: 'Company cache refreshed successfully',
      count: companies.length,
      data: companies
    });
  } catch (error) {
    console.error('❌ Error in refreshCompanies:', error);
    return res.status(500).json({
      success: false,
      message: 'Error refreshing company cache',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/companies/cache-stats
 * Get company cache statistics
 */
export const getCacheStats = async (_req: Request, res: Response) => {
  try {
    const stats = companyApiService.getCacheStats();
    
    return res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Error in getCacheStats:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting cache stats',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
