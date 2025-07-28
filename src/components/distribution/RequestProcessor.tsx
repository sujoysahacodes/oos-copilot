'use client';

import { useDistributionOOSStore } from '../../stores/distributionStore';
import { Brain, FileText, MessageSquare, Clock, CheckCircle, AlertTriangle, Eye, Edit, MoreVertical } from 'lucide-react';
import { useState } from 'react';

export default function RequestProcessor() {
  const {
    changeRequests,
    distributors,
    products,
    analyzeRequest,
    generateSourcePlan,
    approveRequest,
    rejectRequest,
    runFullAnalysis,
    isAnalyzingRequest,
    isGeneratingPlan
  } = useDistributionOOSStore();

  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [showRawText, setShowRawText] = useState<{ [key: string]: boolean }>({});

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'analyzing':
        return <Brain className="h-4 w-4 text-blue-600 animate-pulse" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAnalyze = async (requestId: string) => {
    await analyzeRequest(requestId);
    await generateSourcePlan(requestId);
  };

  const handleApprove = async (requestId: string) => {
    await runFullAnalysis(requestId);
  };

  const handleReject = async (requestId: string) => {
    await rejectRequest(requestId, 'Rejected after manual review');
  };

  const toggleRawText = (requestId: string) => {
    setShowRawText(prev => ({
      ...prev,
      [requestId]: !prev[requestId]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Request Processor</h1>
          <p className="text-gray-600 mt-1">AI-powered analysis of distributor change requests</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
            <Brain className="h-5 w-5 text-green-600" />
            <span className="text-green-700 font-medium">LLM Processing</span>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>New Request</span>
          </button>
        </div>
      </div>

      {/* Processing Queue */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Processing Queue</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {changeRequests.filter(r => r.status === 'pending').length} pending
              </span>
              <span className="text-sm text-gray-500">
                {changeRequests.filter(r => r.status === 'analyzing').length} analyzing
              </span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {changeRequests.map((request) => {
            const distributor = distributors.find(d => d.id === request.distributorId);
            const product = products.find(p => p.id === request.requestedChanges[0]?.productId);
            const isExpanded = selectedRequest === request.id;

            return (
              <div key={request.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      {getStatusIcon(request.status)}
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                        {request.priority.toUpperCase()}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <MessageSquare className="h-4 w-4" />
                        <span>{request.requestSource}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(request.requestDate).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{distributor?.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{request.reason}</p>
                        
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">Request Details</h4>
                            <button
                              onClick={() => toggleRawText(request.id)}
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                            >
                              <Eye className="h-4 w-4" />
                              <span>{showRawText[request.id] ? 'Hide' : 'Show'} Raw Text</span>
                            </button>
                          </div>
                          
                          {showRawText[request.id] ? (
                            <div className="bg-white p-3 rounded border text-sm text-gray-700 font-mono">
                              {request.requestText}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {request.requestedChanges.map((change, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                  <span className="text-gray-700">
                                    {change.type.toUpperCase()} {product?.name}
                                  </span>
                                  <span className="font-medium">
                                    {change.fromQuantity} → {change.toQuantity} units
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">AI Analysis</h4>
                        {request.interpretedRequest ? (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Confidence Score</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-600 h-2 rounded-full" 
                                    style={{ width: `${request.interpretedRequest.confidence * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">
                                  {(request.interpretedRequest.confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Urgency</span>
                                <div className={`mt-1 px-2 py-1 rounded text-xs font-medium ${
                                  request.interpretedRequest.urgencyLevel === 'critical' ? 'bg-red-100 text-red-800' :
                                  request.interpretedRequest.urgencyLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {request.interpretedRequest.urgencyLevel.toUpperCase()}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-600">Revenue Impact</span>
                                <p className="font-medium text-gray-900 mt-1">
                                  ${request.interpretedRequest.estimatedImpact.revenue.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <div>
                              <span className="text-sm text-gray-600">Business Reason</span>
                              <p className="text-sm text-gray-900 mt-1">
                                {request.interpretedRequest.businessReason}
                              </p>
                            </div>

                            <div>
                              <span className="text-sm text-gray-600">Key Terms</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {request.interpretedRequest.keyTerms.map((term, index) => (
                                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                    {term}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic">
                            Analysis pending...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col space-y-2">
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAnalyze(request.id)}
                          disabled={isAnalyzingRequest || isGeneratingPlan}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          <Brain className="h-4 w-4" />
                          <span>Analyze</span>
                        </button>
                      </>
                    )}
                    
                    {request.status === 'analyzing' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          disabled={isAnalyzingRequest}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>{isAnalyzingRequest ? 'Analyzing...' : 'Approve'}</span>
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          disabled={isAnalyzingRequest}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          <AlertTriangle className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedRequest(isExpanded ? null : request.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Deadline Warning */}
                {new Date(request.deadline) < new Date(Date.now() + 3600000) && ( // 1 hour warning
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">
                        Deadline approaching: {new Date(request.deadline).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {changeRequests.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests to process</h3>
              <p className="text-gray-500">All change requests have been processed</p>
            </div>
          )}
        </div>
      </div>

      {/* Processing Status */}
      {(isAnalyzingRequest || isGeneratingPlan) && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
          <Brain className="h-5 w-5 animate-pulse" />
          <span>
            {isAnalyzingRequest ? 'Analyzing request with LLM...' : 'Generating source plan...'}
          </span>
        </div>
      )}
    </div>
  );
}
