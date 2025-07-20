import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useThemeColors, useModalState } from '../../hooks';
import { useOptimizedImage } from '../../hooks/useOptimizedImage';
import Chart from '../Chart';
import Button from '../Button';
import Modal from '../Modal';
import Card, { 
  CardHeader, 
  CardBody, 
  CardTitle, 
  CardText, 
  CardFooter,
  CardActions
} from '../Card';
import { 
  getSalesData, 
  generateRandomSalesData, 
  resetSalesData, 
  getSalesSummary,
  formatCurrency,
  formatPercentage,
  getMetricLabel
} from '../../utils/salesData';
import { FiRefreshCw, FiBarChart, FiTrendingUp, FiTarget, FiDollarSign, FiMail, FiLinkedin, FiMapPin, FiDownload, FiActivity, FiFileText, FiArrowUp, FiArrowDown, FiUser } from 'react-icons/fi';
import styles from './TeamSalesChart.module.scss';

// Generate optimized avatar URLs for different screen sizes
const generateAvatarUrl = (name, background, size = 48) => {
  const encodedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encodedName}&background=${background}&color=ffffff&size=${size}&bold=true&format=webp`;
};

// Generate avatar sources for responsive images
const generateAvatarSources = (name, background) => ({
  small: generateAvatarUrl(name, background, 48),   // Mobile
  medium: generateAvatarUrl(name, background, 64),  // Tablet
  large: generateAvatarUrl(name, background, 96),   // Desktop
  xlarge: generateAvatarUrl(name, background, 128)  // High DPI
});

// Complete team member data with all details
const TEAM_MEMBERS = [
  {
    user: "USR001",
    email: "jay.figueroa@company.com",
    linkedin: "https://www.linkedin.com/in/jayfig89/",
    imgUrl: "/optimized/JayFig.webp",
    useOptimizedImage: true,
    optimizedImageName: "JayFig",
    avatarSources: generateAvatarSources("Jay Figueroa", "3b82f6"),
    firstName: "Jay",
    lastName: "Figueroa",
    birthday: "1985-03-15",
    role: "Senior Sales Manager",
    region: "North America",
    bio: "Experienced sales professional with over 8 years in B2B software solutions. Passionate about building lasting client relationships and exceeding targets."
  },
  {
    user: "USR002",
    email: "michael.chen@company.com",
    linkedin: "https://linkedin.com/in/michael-chen-tech",
    imgUrl: generateAvatarUrl("Michael Chen", "10b981", 48),
    avatarSources: generateAvatarSources("Michael Chen", "10b981"),
    firstName: "Michael",
    lastName: "Chen",
    birthday: "1990-07-22",
    role: "Account Executive",
    region: "Asia Pacific",
    bio: "Dynamic sales professional specializing in enterprise solutions. Fluent in English, Mandarin, and Japanese with strong technical background."
  },
  {
    user: "USR003",
    email: "emma.rodriguez@company.com",
    linkedin: "https://linkedin.com/in/emma-rodriguez-sales",
    imgUrl: generateAvatarUrl("Emma Rodriguez", "f59e0b", 48),
    avatarSources: generateAvatarSources("Emma Rodriguez", "f59e0b"),
    firstName: "Emma",
    lastName: "Rodriguez",
    birthday: "1988-11-08",
    role: "Regional Sales Director",
    region: "Europe",
    bio: "Strategic sales leader with expertise in market expansion and team development. Successfully launched products in 12+ European markets."
  },
  {
    user: "USR004",
    email: "james.williams@company.com",
    linkedin: "https://linkedin.com/in/james-williams-sales",
    imgUrl: generateAvatarUrl("James Williams", "8b5cf6", 48),
    avatarSources: generateAvatarSources("James Williams", "8b5cf6"),
    firstName: "James",
    lastName: "Williams",
    birthday: "1982-05-30",
    role: "VP of Sales",
    region: "Global",
    bio: "Visionary sales executive with 15+ years experience scaling revenue from startup to IPO. Expert in building high-performing sales organizations."
  },
  {
    user: "USR005",
    email: "priya.patel@company.com",
    linkedin: "https://linkedin.com/in/priya-patel-business",
    imgUrl: generateAvatarUrl("Priya Patel", "ef4444", 48),
    avatarSources: generateAvatarSources("Priya Patel", "ef4444"),
    firstName: "Priya",
    lastName: "Patel",
    birthday: "1993-09-12",
    role: "Business Development Rep",
    region: "North America",
    bio: "Energetic BDR with a knack for identifying new opportunities and qualifying prospects. Strong background in SaaS and fintech industries."
  },
  {
    user: "USR006",
    email: "carlos.mendoza@company.com",
    linkedin: "https://linkedin.com/in/carlos-mendoza-sales",
    imgUrl: generateAvatarUrl("Carlos Mendoza", "06b6d4", 48),
    avatarSources: generateAvatarSources("Carlos Mendoza", "06b6d4"),
    firstName: "Carlos",
    lastName: "Mendoza",
    birthday: "1987-01-25",
    role: "Enterprise Account Manager",
    region: "Latin America",
    bio: "Bilingual sales professional specializing in Fortune 500 accounts. Expert in complex deal structuring and stakeholder management."
  },
  {
    user: "USR007",
    email: "lisa.kim@company.com",
    linkedin: "https://linkedin.com/in/lisa-kim-sales",
    imgUrl: generateAvatarUrl("Lisa Kim", "ec4899", 48),
    avatarSources: generateAvatarSources("Lisa Kim", "ec4899"),
    firstName: "Lisa",
    lastName: "Kim",
    birthday: "1991-06-18",
    role: "Inside Sales Representative",
    region: "Asia Pacific",
    bio: "Results-driven sales rep with expertise in SaaS solutions. Consistently exceeds quotas through strategic prospecting and relationship building."
  },
  {
    user: "USR008",
    email: "david.thompson@company.com",
    linkedin: "https://linkedin.com/in/david-thompson-sales",
    imgUrl: generateAvatarUrl("David Thompson", "84cc16", 48),
    avatarSources: generateAvatarSources("David Thompson", "84cc16"),
    firstName: "David",
    lastName: "Thompson",
    birthday: "1984-12-03",
    role: "Sales Operations Manager",
    region: "North America",
    bio: "Data-driven sales operations expert focused on process optimization and sales enablement. Specializes in CRM implementation and analytics."
  },
  {
    user: "USR009",
    email: "maria.garcia@company.com",
    linkedin: "https://linkedin.com/in/maria-garcia-sales",
    imgUrl: generateAvatarUrl("Maria Garcia", "f97316", 48),
    avatarSources: generateAvatarSources("Maria Garcia", "f97316"),
    firstName: "Maria",
    lastName: "Garcia",
    birthday: "1989-04-14",
    role: "Key Account Manager",
    region: "Latin America",
    bio: "Strategic account manager with deep expertise in enterprise software sales. Fluent in Spanish, English, and Portuguese."
  },
  {
    user: "USR010",
    email: "alex.anderson@company.com",
    linkedin: "https://linkedin.com/in/alex-anderson-sales",
    imgUrl: generateAvatarUrl("Alex Anderson", "6366f1", 48),
    avatarSources: generateAvatarSources("Alex Anderson", "6366f1"),
    firstName: "Alex",
    lastName: "Anderson",
    birthday: "1992-08-27",
    role: "Sales Development Rep",
    region: "Europe",
    bio: "Ambitious SDR with strong prospecting skills and passion for technology sales. Excellent at qualifying leads and setting appointments."
  }
];

// Smart Avatar Component that uses optimized images with accessibility and performance features
const SmartAvatar = ({ member, size = 48, className = "", priority = false, ...props }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Determine loading priority based on context and size
  const isEager = priority || size >= 80; // Larger images or priority images load eagerly
  
  const optimizedImage = useOptimizedImage(member.optimizedImageName || '', {
    sizes: `(max-width: 768px) ${Math.min(size, 48)}px, ${size}px`,
    eager: isEager,
    fallbackFormat: 'png'
  });

  // Use optimized image if available, supported, and not errored
  const shouldUseOptimized = member.useOptimizedImage && 
                           optimizedImage.src && 
                           !optimizedImage.isLoading && 
                           !imageError &&
                           optimizedImage.src !== `/images/${member.optimizedImageName}.png`; // Don't use fallback path
  
  const handleImageError = (event) => {
    console.warn(`Failed to load optimized image for ${member.firstName} ${member.lastName}:`, {
      src: event.target.src,
      naturalWidth: event.target.naturalWidth,
      naturalHeight: event.target.naturalHeight,
      error: 'Image load failed'
    });
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Enhanced alt text for accessibility
  const altText = `Profile photo of ${member.firstName} ${member.lastName}, ${member.role}`;

  if (shouldUseOptimized) {
    return (
      <img
        src={optimizedImage.src}
        srcSet={optimizedImage.srcSet}
        sizes={optimizedImage.sizes}
        alt={altText}
        width={size}
        height={size}
        loading={isEager ? "eager" : "lazy"}
        decoding="async"
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          opacity: imageLoaded ? 1 : 0.7,
          transition: 'opacity 0.2s ease-in-out',
          backgroundColor: '#f3f4f6', // Neutral background while loading
          ...props.style
        }}
        {...props}
      />
    );
  }

  // Fallback to generated avatar with performance optimization
  const avatarUrl = member.avatarSources ? 
    (size <= 48 ? member.avatarSources.small :
     size <= 64 ? member.avatarSources.medium :
     size <= 96 ? member.avatarSources.large :
     member.avatarSources.xlarge) :
    generateAvatarUrl(`${member.firstName} ${member.lastName}`, "3b82f6", size);

  return (
    <img
      src={avatarUrl}
      alt={`Generated avatar for ${member.firstName} ${member.lastName}, ${member.role}`}
      width={size}
      height={size}
      loading={isEager ? "eager" : "lazy"}
      decoding="async"
      className={className}
      onLoad={handleImageLoad}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        objectFit: 'cover',
        opacity: imageLoaded ? 1 : 0.7,
        transition: 'opacity 0.2s ease-in-out',
        backgroundColor: '#f3f4f6',
        ...props.style
      }}
      {...props}
    />
  );
};

const TeamSalesChart = () => {
  const [salesData, setSalesData] = useState(() => getSalesData());
  const [selectedMetrics, setSelectedMetrics] = useState(['currentMonth']); // Array for multiple selection
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [chartType, setChartType] = useState('bar'); // 'bar', 'line'
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' }); // Chart sorting
  const chartRef = useRef(null);

  // Preload Jay Figueroa's image for better performance
  useEffect(() => {
    const jayImage = new Image();
    jayImage.src = '/optimized/JayFig.webp';
    jayImage.onload = () => console.log('Jay Figueroa image preloaded successfully');
    jayImage.onerror = () => console.warn('Failed to preload Jay Figueroa image');
  }, []);
  
  // Modal state management
  const { isOpen, openModal, closeModal } = useModalState();

  // Enhanced close modal function that also clears selected member
  const handleCloseModal = useCallback(() => {
    setSelectedMember(null);
    closeModal();
  }, [closeModal]);
  
  // Theme colors hook for potential future use
  useThemeColors();


  // Handle metric toggle (can select multiple metrics)
  const handleMetricToggle = useCallback((metricKey) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metricKey)) {
        // Remove metric if already selected (but keep at least one)
        return prev.length > 1 ? prev.filter(m => m !== metricKey) : prev;
      } else {
        // Add metric if not selected
        return [...prev, metricKey];
      }
    });
  }, []);

  // Sorting functionality for chart data with keyboard support
  const handleSort = useCallback((sortBy) => {
    setSortConfig(prev => ({
      key: sortBy,
      direction: prev.key === sortBy && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Keyboard navigation for sorting controls
  const handleSortKeyDown = useCallback((event, sortBy) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSort(sortBy);
    }
  }, [handleSort]);

  // Get sorted team members based on current sort configuration
  const sortedTeamMembers = useMemo(() => {
    const sortedMembers = [...TEAM_MEMBERS];
    
    if (sortConfig.key === 'name') {
      sortedMembers.sort((a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        if (sortConfig.direction === 'asc') {
          return nameA.localeCompare(nameB);
        }
        return nameB.localeCompare(nameA);
      });
    } else {
      // Sort by metric value
      const primaryMetric = selectedMetrics[0] || 'currentMonth';
      sortedMembers.sort((a, b) => {
        const valueA = salesData[a.user]?.[primaryMetric] || 0;
        const valueB = salesData[b.user]?.[primaryMetric] || 0;
        if (sortConfig.direction === 'asc') {
          return valueA - valueB;
        }
        return valueB - valueA;
      });
    }
    
    return sortedMembers;
  }, [sortConfig, selectedMetrics, salesData]);

  // Generate performance-based colors for team members
  const getPerformanceColor = useCallback((memberData, alpha = 1) => {
    if (!memberData) return `rgba(156, 163, 175, ${alpha})`; // neutral gray
    
    const performance = (memberData.currentMonth / memberData.target) * 100;
    
    if (performance >= 100) {
      return `rgba(34, 197, 94, ${alpha})`; // green-500 - exceeding target
    } else if (performance >= 90) {
      return `rgba(59, 130, 246, ${alpha})`; // blue-500 - close to target
    } else if (performance >= 70) {
      return `rgba(245, 158, 11, ${alpha})`; // amber-500 - moderate performance
    } else {
      return `rgba(239, 68, 68, ${alpha})`; // red-500 - needs improvement
    }
  }, []);

  // Chart data formatted for Chart.js with multiple metrics, performance colors, and sorting
  const chartData = useMemo(() => {
    const labels = sortedTeamMembers.map(member => `${member.firstName} ${member.lastName}`);
    const datasets = [];
    
    // Color mapping for different metrics
    const metricColors = {
      currentMonth: { base: 'rgba(59, 130, 246, 0.8)', border: 'rgba(59, 130, 246, 1)' },
      lastMonth: { base: 'rgba(168, 85, 247, 0.8)', border: 'rgba(168, 85, 247, 1)' },
      target: { base: 'rgba(34, 197, 94, 0.8)', border: 'rgba(34, 197, 94, 1)' },
      ytd: { base: 'rgba(245, 158, 11, 0.8)', border: 'rgba(245, 158, 11, 1)' }
    };

    selectedMetrics.forEach(metricKey => {
      const metricData = sortedTeamMembers.map(member => {
        const memberSales = salesData[member.user];
        return memberSales ? memberSales[metricKey] : 0;
      });

      // Generate performance-based colors for bars (only for currentMonth comparison)
      const backgroundColors = sortedTeamMembers.map(member => {
        const memberSales = salesData[member.user];
        if (metricKey === 'currentMonth') {
          return getPerformanceColor(memberSales, 0.8);
        } else {
          return metricColors[metricKey]?.base || metricColors.currentMonth.base;
        }
      });

      const borderColors = sortedTeamMembers.map(member => {
        const memberSales = salesData[member.user];
        if (metricKey === 'currentMonth') {
          return getPerformanceColor(memberSales, 1);
        } else {
          return metricColors[metricKey]?.border || metricColors.currentMonth.border;
        }
      });

      const dataset = {
        label: getMetricLabel(metricKey),
        data: metricData,
        backgroundColor: chartType === 'line' ? 'transparent' : backgroundColors,
        borderColor: borderColors,
        borderWidth: chartType === 'line' ? 3 : 2,
        ...(chartType === 'line' ? {
          type: 'line',
          tension: 0.4,
          pointBackgroundColor: borderColors,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: false
        } : {
          borderRadius: 4,
          borderSkipped: false
        })
      };

      datasets.push(dataset);
    });
    
    return { labels, datasets };
  }, [salesData, selectedMetrics, chartType, getPerformanceColor, sortedTeamMembers]);

  // Sales summary statistics
  const summary = useMemo(() => {
    return getSalesSummary(salesData);
  }, [salesData]);

  // Handle chart bar clicks
  const handleChartClick = useCallback((event, elements) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const member = sortedTeamMembers[clickedIndex];
      setSelectedMember(member);
      openModal();
    }
  }, [openModal, sortedTeamMembers]);

  // Chart configuration
  const chartConfig = useMemo(() => ({
    type: chartType,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onClick: handleChartClick,
      plugins: {
        title: {
          display: true,
          text: `Team Sales Performance - ${selectedMetrics.map(getMetricLabel).join(', ')} (${chartType === 'line' ? 'Line Chart' : 'Bar Chart'}) - Sorted by ${sortConfig.key === 'name' ? 'Name' : getMetricLabel(selectedMetrics[0] || 'currentMonth')} (${sortConfig.direction === 'asc' ? 'Ascending' : 'Descending'})`,
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        legend: {
          display: selectedMetrics.length > 1,
          position: 'top',
          labels: {
            usePointStyle: chartType === 'line',
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed.y;
              const memberIndex = context.dataIndex;
              const member = sortedTeamMembers[memberIndex];
              const memberData = salesData[member.user];
              
              const datasetLabel = context.dataset.label;
              let label = `${datasetLabel}: ${formatCurrency(value)}`;
              
              // Add performance info for current month
              if (datasetLabel.includes('Current Month') && memberData) {
                const performance = (memberData.currentMonth / memberData.target) * 100;
                label += `\nTarget: ${formatCurrency(memberData.target)}`;
                label += `\nPerformance: ${formatPercentage(performance)}`;
                
                // Add performance level indicator
                if (performance >= 100) {
                  label += ` 🎯 Exceeding Target`;
                } else if (performance >= 90) {
                  label += ` 📈 Close to Target`;
                } else if (performance >= 70) {
                  label += ` ⚠️ Moderate Performance`;
                } else {
                  label += ` 🔴 Needs Improvement`;
                }
              }
              
              label += `\n\nClick to view ${member.firstName}'s profile`;
              
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatCurrency(value)
          }
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            callback: function(value, index) {
              const member = sortedTeamMembers[index];
              return `${member.firstName} ${member.lastName}`;
            }
          }
        }
      },
      elements: {
        bar: {
          borderWidth: 2,
          borderRadius: 4,
          hoverBorderWidth: 3,
          hoverBackgroundColor: function(context) {
            return context.parsed.backgroundColor;
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  }), [selectedMetrics, salesData, handleChartClick, chartType, sortConfig, sortedTeamMembers]);

  // Generate new random data
  const handleGenerateRandomData = async () => {
    setIsGenerating(true);
    
    // Add a delay for better UX and to show loading text
    setTimeout(() => {
      const newData = generateRandomSalesData();
      setSalesData(newData);
      setIsGenerating(false);
    }, 1500); // Increased to 1.5 seconds to show loading text clearly
  };

  // Reset to initial data
  const handleResetData = () => {
    const initialData = resetSalesData();
    setSalesData(initialData);
  };

  // Export chart to optimized PNG with responsive sizing
  const handleExportPNG = useCallback(() => {
    if (chartRef.current && chartRef.current.exportToPNG) {
      try {
        const filename = `team-sales-${selectedMetrics.join('-')}-${chartType}-${new Date().toISOString().split('T')[0]}.png`;
        
        // Determine optimal export size based on screen size
        const screenWidth = window.innerWidth;
        const isMobile = screenWidth <= 768;
        const isTablet = screenWidth <= 1024 && screenWidth > 768;
        
        const exportOptions = {
          width: isMobile ? 800 : isTablet ? 1200 : 1600,  // Responsive export width
          height: isMobile ? 600 : isTablet ? 800 : 1000,  // Responsive export height
          quality: 0.95,                                   // High quality but compressed
          pixelRatio: 2,                                   // Retina-ready
          backgroundColor: '#ffffff'                       // Clean white background
        };
        
        console.log(`Exporting chart at ${exportOptions.width}x${exportOptions.height} for ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'} optimization`);
        
        const result = chartRef.current.exportToPNG(filename, exportOptions);
        
        if (!result) {
          // Fallback: show user-friendly message
          alert('Export failed. Please ensure the chart is fully loaded and try again.');
        }
      } catch (error) {
        console.error('Failed to export chart:', error);
        alert('Export failed. Please try again.');
      }
    } else {
      console.warn('Chart export function not available');
      alert('Chart is not ready for export. Please wait for the chart to load completely.');
    }
  }, [selectedMetrics, chartType]);

  // Export comprehensive PDF report
  const handleExportPDF = useCallback(async () => {
    try {
      // Create PDF content using browser's print functionality with custom styling
      const printWindow = window.open('', '_blank');
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      // Generate chart image for PDF
      let chartImageData = '';
      if (chartRef.current && chartRef.current.toDataURL) {
        try {
          chartImageData = chartRef.current.toDataURL('image/png', 1);
        } catch (error) {
          console.warn('Could not export chart image for PDF:', error);
        }
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Team Sales Report - ${currentDate}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              background: white;
              padding: 40px;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px; 
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 20px;
            }
            .header h1 { 
              font-size: 28px; 
              color: #1f2937; 
              margin-bottom: 8px;
            }
            .header p { 
              color: #6b7280; 
              font-size: 16px;
            }
            .summary { 
              display: grid; 
              grid-template-columns: repeat(4, 1fr); 
              gap: 20px; 
              margin-bottom: 40px;
            }
            .summary-card { 
              background: #f9fafb; 
              padding: 20px; 
              border-radius: 8px; 
              text-align: center;
              border: 1px solid #e5e7eb;
            }
            .summary-value { 
              font-size: 24px; 
              font-weight: bold; 
              color: #1f2937; 
              margin-bottom: 4px;
            }
            .summary-label { 
              font-size: 14px; 
              color: #6b7280;
            }
            .chart-section { 
              margin-bottom: 40px; 
              text-align: center;
            }
            .chart-section h2 { 
              font-size: 20px; 
              margin-bottom: 20px; 
              color: #1f2937;
            }
            .chart-image { 
              max-width: 100%; 
              height: auto; 
              border: 1px solid #e5e7eb;
              border-radius: 8px;
            }
            .team-section h2 { 
              font-size: 20px; 
              margin-bottom: 20px; 
              color: #1f2937;
            }
            .team-grid { 
              display: grid; 
              grid-template-columns: repeat(2, 1fr); 
              gap: 20px;
            }
            .member-card { 
              background: #f9fafb; 
              padding: 20px; 
              border-radius: 8px;
              border: 1px solid #e5e7eb;
            }
            .member-header { 
              display: flex; 
              align-items: center; 
              gap: 15px; 
              margin-bottom: 15px;
            }
            .member-avatar { 
              width: 60px; 
              height: 60px; 
              border-radius: 50%; 
              object-fit: cover;
            }
            .member-info h3 { 
              font-size: 18px; 
              color: #1f2937; 
              margin-bottom: 4px;
            }
            .member-role { 
              color: #6b7280; 
              font-size: 14px;
            }
            .member-stats { 
              display: grid; 
              grid-template-columns: repeat(2, 1fr); 
              gap: 10px;
            }
            .stat { 
              text-align: center; 
              padding: 10px;
              background: white;
              border-radius: 4px;
            }
            .stat-value { 
              font-weight: bold; 
              color: #1f2937;
              font-size: 16px;
            }
            .stat-label { 
              font-size: 12px; 
              color: #6b7280;
            }
            .performance-indicator {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 600;
              margin-top: 8px;
            }
            .performance-excellent { background: #dcfce7; color: #166534; }
            .performance-good { background: #dbeafe; color: #1d4ed8; }
            .performance-fair { background: #fef3c7; color: #92400e; }
            .performance-needs-improvement { background: #fee2e2; color: #dc2626; }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              color: #6b7280; 
              font-size: 14px;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            @media print {
              body { padding: 20px; }
              .chart-section { page-break-before: avoid; }
              .team-section { page-break-before: auto; }
              .member-card { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Team Sales Performance Report</h1>
            <p>Generated on ${currentDate} | Metrics: ${selectedMetrics.map(getMetricLabel).join(', ')} | Sorted by: ${sortConfig.key === 'name' ? 'Name' : getMetricLabel(selectedMetrics[0] || 'currentMonth')} (${sortConfig.direction === 'asc' ? 'Ascending' : 'Descending'})</p>
          </div>

          <div class="summary">
            <div class="summary-card">
              <div class="summary-value">${formatCurrency(summary.totalCurrentMonth)}</div>
              <div class="summary-label">Total Current Month</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">${formatPercentage(summary.currentMonthPerformance)}</div>
              <div class="summary-label">Target Achievement</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">${summary.monthOverMonth > 0 ? '+' : ''}${formatPercentage(summary.monthOverMonth)}</div>
              <div class="summary-label">Month over Month</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">${formatCurrency(summary.totalYTD)}</div>
              <div class="summary-label">Year to Date</div>
            </div>
          </div>

          ${chartImageData ? `
          <div class="chart-section">
            <h2>Sales Performance Chart (${chartType === 'line' ? 'Line Chart' : 'Bar Chart'})</h2>
            <img src="${chartImageData}" alt="Team Sales Chart" class="chart-image" />
          </div>
          ` : ''}

          <div class="team-section">
            <h2>Team Member Performance Details</h2>
            <div class="team-grid">
              ${sortedTeamMembers.map(member => {
                const memberSales = salesData[member.user];
                const performance = memberSales ? (memberSales.currentMonth / memberSales.target) * 100 : 0;
                const performanceClass = performance >= 100 ? 'excellent' : 
                                       performance >= 90 ? 'good' : 
                                       performance >= 70 ? 'fair' : 'needs-improvement';
                const performanceText = performance >= 100 ? 'Exceeding Target' : 
                                       performance >= 90 ? 'Close to Target' : 
                                       performance >= 70 ? 'Moderate Performance' : 'Needs Improvement';
                
                // Choose the best image source for PDF
                const avatarSrc = member.useOptimizedImage && member.imgUrl ? 
                  member.imgUrl : 
                  member.avatarSources.large;
                
                return `
                  <div class="member-card">
                    <div class="member-header">
                      <img src="${avatarSrc}" alt="${member.firstName} ${member.lastName}" class="member-avatar" />
                      <div class="member-info">
                        <h3>${member.firstName} ${member.lastName}</h3>
                        <div class="member-role">${member.role}</div>
                        <div class="performance-indicator performance-${performanceClass}">
                          ${performanceText}
                        </div>
                      </div>
                    </div>
                    <div class="member-stats">
                      <div class="stat">
                        <div class="stat-value">${formatCurrency(memberSales?.currentMonth || 0)}</div>
                        <div class="stat-label">Current Month</div>
                      </div>
                      <div class="stat">
                        <div class="stat-value">${formatCurrency(memberSales?.target || 0)}</div>
                        <div class="stat-label">Target</div>
                      </div>
                      <div class="stat">
                        <div class="stat-value">${formatPercentage(performance)}</div>
                        <div class="stat-label">Achievement</div>
                      </div>
                      <div class="stat">
                        <div class="stat-value">${formatCurrency(memberSales?.ytd || 0)}</div>
                        <div class="stat-label">YTD Total</div>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="footer">
            <p>Team Sales Performance Report | ${TEAM_MEMBERS.length} Team Members | Export Date: ${currentDate}</p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for images to load before printing
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };
      
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('PDF export failed. Please try again.');
    }
  }, [selectedMetrics, chartType, summary, salesData, sortConfig, sortedTeamMembers]);


  // Metric options
  const metricOptions = [
    { key: 'currentMonth', label: 'Current Month', icon: FiDollarSign },
    { key: 'lastMonth', label: 'Last Month', icon: FiTrendingUp },
    { key: 'target', label: 'Monthly Target', icon: FiTarget },
    { key: 'ytd', label: 'Year to Date', icon: FiBarChart }
  ];

  return (
    <div className={styles.container}>
      <Card variant="bordered" elevation="medium">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardText>
            Track team performance with persistent data that maintains values across page refreshes
          </CardText>
        </CardHeader>

        <CardBody>
          {/* Summary Statistics */}
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon}>
                <FiDollarSign />
              </div>
              <div className={styles.summaryContent}>
                <div className={styles.summaryValue}>
                  {formatCurrency(summary.totalCurrentMonth)}
                </div>
                <div className={styles.summaryLabel}>Total Current Month</div>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon}>
                <FiTarget />
              </div>
              <div className={styles.summaryContent}>
                <div className={styles.summaryValue}>
                  {formatPercentage(summary.currentMonthPerformance)}
                </div>
                <div className={styles.summaryLabel}>Target Achievement</div>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon}>
                <FiTrendingUp />
              </div>
              <div className={styles.summaryContent}>
                <div className={styles.summaryValue}>
                  {summary.monthOverMonth > 0 ? '+' : ''}{formatPercentage(summary.monthOverMonth)}
                </div>
                <div className={styles.summaryLabel}>Month over Month</div>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon}>
                <FiBarChart />
              </div>
              <div className={styles.summaryContent}>
                <div className={styles.summaryValue}>
                  {formatCurrency(summary.totalYTD)}
                </div>
                <div className={styles.summaryLabel}>Year to Date</div>
              </div>
            </div>
          </div>

          {/* Metric Selection */}
          <div className={styles.metricControls}>
            <h4>Metrics Selection</h4>
            <div className={styles.metricButtons}>
              {metricOptions.map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant={selectedMetrics.includes(key) ? 'primary' : 'outline'}
                  size="small"
                  onClick={() => handleMetricToggle(key)}
                  leftIcon={<Icon aria-hidden="true" />}
                  className={styles.metricButton}
                  aria-pressed={selectedMetrics.includes(key)}
                  data-seo-element={`metric-${key}`}
                >
                  <span className={styles.buttonText}>{label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionControls}>
            <h4>Data Actions</h4>
            <div className={styles.actionButtons}>
              <Button
                variant="secondary"
                size="small"
                onClick={handleResetData}
                leftIcon={<FiRefreshCw aria-hidden="true" />}
                data-seo-element="reset-data-button"
                aria-describedby="reset-desc"
              >
                Reset to Initial
              </Button>

              <Button
                variant="success"
                size="small"
                onClick={handleGenerateRandomData}
                disabled={isGenerating}
                leftIcon={<FiRefreshCw aria-hidden="true" className={isGenerating ? styles.spinningIcon : ''} />}
                data-seo-element="generate-data-button"
                aria-describedby="generate-desc"
                aria-busy={isGenerating}
                className={isGenerating ? styles.loadingButton : ''}
              >
                <span className={isGenerating ? styles.loadingText : styles.buttonText}>
                  {isGenerating ? 'Generating New Data...' : 'Generate Random Data'}
                </span>
              </Button>

              <Button
                variant="info"
                size="small"
                onClick={handleExportPNG}
                leftIcon={<FiDownload aria-hidden="true" />}
                data-seo-element="export-chart-button"
                aria-describedby="export-desc"
              >
                Export PNG
              </Button>

              <Button
                variant="warning"
                size="small"
                onClick={handleExportPDF}
                leftIcon={<FiFileText aria-hidden="true" />}
                data-seo-element="export-pdf-button"
                aria-describedby="export-pdf-desc"
              >
                Export PDF Report
              </Button>
            </div>
          </div>

          {/* Chart Type Controls */}
          <div className={styles.chartTypeControls}>
            <h4>Chart Type</h4>
            <div className={styles.chartTypeButtons}>
              <Button
                variant={chartType === 'bar' ? 'primary' : 'outline'}
                size="small"
                onClick={() => setChartType('bar')}
                leftIcon={<FiBarChart aria-hidden="true" />}
                className={styles.chartTypeButton}
                aria-pressed={chartType === 'bar'}
                data-seo-element="bar-chart-button"
              >
                <span className={styles.buttonText}>Bar Chart</span>
              </Button>
              <Button
                variant={chartType === 'line' ? 'primary' : 'outline'}
                size="small"
                onClick={() => setChartType('line')}
                leftIcon={<FiActivity aria-hidden="true" />}
                className={styles.chartTypeButton}
                aria-pressed={chartType === 'line'}
                data-seo-element="line-chart-button"
              >
                <span className={styles.buttonText}>Line Chart</span>
              </Button>
            </div>
          </div>

          {/* Chart Sorting Controls */}
          <div className={styles.sortingControls}>
            <h4 id="sorting-controls-heading">Data Sorting</h4>
            <p className={styles.sortingDescription}>
              Sort chart data by team member names or performance values in ascending or descending order
            </p>
            <div className={styles.sortingButtons} role="group" aria-labelledby="sorting-controls-heading">
              <Button
                variant={sortConfig.key === 'name' ? 'success' : 'outline'}
                size="small"
                onClick={() => handleSort('name')}
                onKeyDown={(e) => handleSortKeyDown(e, 'name')}
                leftIcon={<FiUser aria-hidden="true" />}
                rightIcon={sortConfig.key === 'name' ? 
                  (sortConfig.direction === 'asc' ? <FiArrowUp aria-hidden="true" /> : <FiArrowDown aria-hidden="true" />) : 
                  null}
                className={styles.sortButton}
                aria-pressed={sortConfig.key === 'name'}
                aria-describedby="sort-name-desc"
                data-seo-element="sort-by-name-button"
                tabIndex={0}
              >
                <span className={styles.buttonText}>
                  Sort by Name {sortConfig.key === 'name' && `(${sortConfig.direction === 'asc' ? 'A-Z' : 'Z-A'})`}
                </span>
              </Button>
              
              <Button
                variant={sortConfig.key !== 'name' ? 'success' : 'outline'}
                size="small"
                onClick={() => handleSort('value')}
                onKeyDown={(e) => handleSortKeyDown(e, 'value')}
                leftIcon={<FiTrendingUp aria-hidden="true" />}
                rightIcon={sortConfig.key !== 'name' ? 
                  (sortConfig.direction === 'asc' ? <FiArrowUp aria-hidden="true" /> : <FiArrowDown aria-hidden="true" />) : 
                  null}
                className={styles.sortButton}
                aria-pressed={sortConfig.key !== 'name'}
                aria-describedby="sort-value-desc"
                data-seo-element="sort-by-value-button"
                tabIndex={0}
              >
                <span className={styles.buttonText}>
                  Sort by {getMetricLabel(selectedMetrics[0] || 'currentMonth')} {sortConfig.key !== 'name' && `(${sortConfig.direction === 'asc' ? 'Low-High' : 'High-Low'})`}
                </span>
              </Button>
            </div>
            
            {/* Screen reader descriptions */}
            <div className="sr-only">
              <p id="sort-name-desc">
                {sortConfig.key === 'name' 
                  ? `Currently sorting by team member names in ${sortConfig.direction === 'asc' ? 'alphabetical' : 'reverse alphabetical'} order. Click to toggle sort direction.`
                  : 'Click to sort team members by their names alphabetically'
                }
              </p>
              <p id="sort-value-desc">
                {sortConfig.key !== 'name' 
                  ? `Currently sorting by ${getMetricLabel(selectedMetrics[0] || 'currentMonth').toLowerCase()} values from ${sortConfig.direction === 'asc' ? 'lowest to highest' : 'highest to lowest'}. Click to toggle sort direction.`
                  : `Click to sort team members by their ${getMetricLabel(selectedMetrics[0] || 'currentMonth').toLowerCase()} values`
                }
              </p>
              <p id="current-sort-status" aria-live="polite">
                Chart is currently sorted by {sortConfig.key === 'name' ? 'team member names' : getMetricLabel(selectedMetrics[0] || 'currentMonth').toLowerCase()} 
                in {sortConfig.direction === 'asc' ? 'ascending' : 'descending'} order
              </p>
            </div>
          </div>

          {/* Performance Legend (only show for current month) */}
          {selectedMetrics.includes('currentMonth') && (
            <div className={styles.performanceLegend}>
              <h4>Performance Levels</h4>
              <div className={styles.legendItems}>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: 'rgba(34, 197, 94, 0.8)' }}></div>
                  <span>🎯 Exceeding Target (100%+)</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: 'rgba(59, 130, 246, 0.8)' }}></div>
                  <span>📈 Close to Target (90%+)</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: 'rgba(245, 158, 11, 0.8)' }}></div>
                  <span>⚠️ Moderate Performance (70%+)</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }}></div>
                  <span>🔴 Needs Improvement (&lt;70%)</span>
                </div>
              </div>
            </div>
          )}

          {/* Chart Display */}
          <div className={styles.chartContainer}>
            <Chart
              ref={chartRef}
              data={chartData}
              {...chartConfig}
              ariaLabel={`${chartType === 'line' ? 'Line' : 'Bar'} chart showing ${selectedMetrics.map(getMetricLabel).join(', ')} for ${TEAM_MEMBERS.length} team members with performance-based colors`}
              ariaDescription={`Interactive ${chartType} chart displaying team sales data sorted by ${sortConfig.key === 'name' ? 'team member names' : getMetricLabel(selectedMetrics[0] || 'currentMonth')} in ${sortConfig.direction === 'asc' ? 'ascending' : 'descending'} order. Current selection: ${selectedMetrics.map(getMetricLabel).join(', ')}. Performance colors: Green (100%+ target), Blue (90%+ target), Amber (70%+ target), Red (below 70%). Use the sorting controls and metric buttons above to change the view. Click on any ${chartType === 'line' ? 'point' : 'bar'} to view team member details.`}
            />
          </div>

          {/* Team Member List */}
          <div className={styles.teamList}>
            <h3 className={styles.teamListTitle}>Team Members - Click to View Details</h3>
            <div className={styles.memberGrid}>
              {sortedTeamMembers.map((member) => {
                const memberSales = salesData[member.user];
                const performance = memberSales ? (memberSales.currentMonth / memberSales.target) * 100 : 0;
                
                return (
                  <button
                    key={member.user}
                    className={styles.memberCard}
                    onClick={() => {
                      setSelectedMember(member);
                      openModal();
                    }}
                    aria-label={`View details for ${member.firstName} ${member.lastName}, ${member.role}`}
                    data-seo-element={`team-member-${member.user}`}
                  >
                    <div className={styles.memberAvatar}>
                      <SmartAvatar
                        member={member}
                        size={48}
                        className={styles.avatarImage}
                        priority={member.user === "USR001"} // Jay Figueroa gets priority loading
                      />
                    </div>
                    <div className={styles.memberInfo}>
                      <div className={styles.memberName}>
                        {member.firstName} {member.lastName}
                      </div>
                      <div className={styles.memberRole}>{member.role}</div>
                      <div className={styles.memberSales}>
                        {formatCurrency(memberSales?.currentMonth || 0)}
                        <span className={styles.memberPerformance} data-performance={performance >= 100 ? 'good' : performance >= 90 ? 'ok' : 'low'}>
                          {formatPercentage(performance)}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Screen reader descriptions */}
          <div className="sr-only">
            <p id="reset-desc">Reset all sales data back to the original initial values</p>
            <p id="generate-desc">
              {isGenerating 
                ? "Generating new random sales data for all team members..." 
                : "Generate new random sales data for all team members"
              }
            </p>
            <p id="export-desc">Export the current chart view as a PNG image file</p>
            <p id="export-pdf-desc">
              Export a comprehensive PDF report including the sales chart, team member performance details, 
              summary statistics, and individual member cards with performance indicators
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Team Member Details Modal */}
      <Modal
        isOpen={isOpen && !!selectedMember}
        onClose={handleCloseModal}
        size="large"
        ariaLabel="Team member details"
        ariaDescription="Detailed information about the selected team member including sales performance and contact information"
      >
        {selectedMember && (
          <Card variant="elevated" elevation="high">
            <CardHeader>
              <div className={styles.memberHeader}>
                <div className={styles.modalAvatar}>
                  <SmartAvatar
                    member={selectedMember}
                    size={80}
                    className={styles.modalAvatarImage}
                    priority={true} // Modal images are priority
                  />
                </div>
                <div className={styles.memberTitleInfo}>
                  <CardTitle>
                    {selectedMember.firstName} {selectedMember.lastName}
                  </CardTitle>
                  <CardText>{selectedMember.role}</CardText>
                  <div className={styles.memberLocation}>
                    <FiMapPin aria-hidden="true" />
                    {selectedMember.region}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardBody>
              <div className={styles.memberDetails}>
                {/* Sales Performance */}
                <div className={styles.performanceSection}>
                  <h4>Sales Performance</h4>
                  <div className={styles.performanceGrid}>
                    <div className={styles.performanceCard}>
                      <div className={styles.performanceValue}>
                        {formatCurrency(salesData[selectedMember.user]?.currentMonth || 0)}
                      </div>
                      <div className={styles.performanceLabel}>Current Month</div>
                    </div>
                    <div className={styles.performanceCard}>
                      <div className={styles.performanceValue}>
                        {formatCurrency(salesData[selectedMember.user]?.target || 0)}
                      </div>
                      <div className={styles.performanceLabel}>Monthly Target</div>
                    </div>
                    <div className={styles.performanceCard}>
                      <div className={styles.performanceValue}>
                        {salesData[selectedMember.user] ? 
                          formatPercentage((salesData[selectedMember.user].currentMonth / salesData[selectedMember.user].target) * 100) 
                          : '0%'
                        }
                      </div>
                      <div className={styles.performanceLabel}>Achievement</div>
                    </div>
                    <div className={styles.performanceCard}>
                      <div className={styles.performanceValue}>
                        {formatCurrency(salesData[selectedMember.user]?.ytd || 0)}
                      </div>
                      <div className={styles.performanceLabel}>Year to Date</div>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className={styles.personalSection}>
                  <h4>About</h4>
                  <CardText>{selectedMember.bio}</CardText>
                </div>

                {/* Contact Information */}
                <div className={styles.contactSection}>
                  <h4>Contact</h4>
                  <div className={styles.contactInfo}>
                    <a 
                      href={`mailto:${selectedMember.email}`}
                      className={styles.contactLink}
                      aria-label={`Send email to ${selectedMember.firstName}`}
                      data-seo-element="email-link"
                    >
                      <FiMail aria-hidden="true" />
                      {selectedMember.email}
                    </a>
                    <a 
                      href={selectedMember.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.contactLink}
                      aria-label={`View ${selectedMember.firstName}'s LinkedIn profile (opens in new tab)`}
                      data-seo-element="linkedin-link"
                    >
                      <FiLinkedin aria-hidden="true" />
                      LinkedIn Profile
                    </a>
                  </div>
                </div>
              </div>
            </CardBody>

            <CardFooter>
              <CardActions justify="end">
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                  data-seo-element="modal-close-button"
                >
                  Close
                </Button>
              </CardActions>
            </CardFooter>
          </Card>
        )}
      </Modal>
    </div>
  );
};

export default TeamSalesChart;