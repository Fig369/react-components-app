import { useState, useMemo } from 'react';
import ChartComponent from '../ChartComponent';
import Button from '../Button';
import { ALL_MONTHS, getMonthsByRange } from '../../utils/dateUtils';
import { userData } from '../../utils/userData';
import './TeamAnalytics.scss';

// Extract team members for easier access
const TEAM_MEMBERS = userData.users.map(user => ({
  id: user.user,
  name: `${user.firstName} ${user.lastName}`,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  region: user.region,
  imgUrl: user.imgUrl
}));

/**
 * Team Analytics Component
 * Provides team member filtering and analytics on top of the reusable ChartComponent
 */
const TeamAnalytics = () => {
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [showTeamFilter, setShowTeamFilter] = useState(false);
  const [timeRange, setTimeRange] = useState('6');

  // Generate team member data with sales metrics
  const generateTeamMemberData = (months) => {
    return months.map(month => {
      const monthData = {
        ...month,
        activeDays: month.maxDays,
        teamData: {}
      };

      // Generate data for each team member
      TEAM_MEMBERS.forEach(member => {
        const monthlyTotal = Math.floor(Math.random() * 20) + 1;
        const dailyData = Array.from({ length: month.maxDays }, () => 
          Math.floor(Math.random() * 10) + 1
        );
        
        // Generate weekly data (4-5 weeks per month)
        const weeklyData = [];
        for (let week = 0; week < Math.ceil(month.maxDays / 7); week++) {
          const weekStart = week * 7;
          const weekEnd = Math.min(weekStart + 7, month.maxDays);
          const weekTotal = dailyData.slice(weekStart, weekEnd).reduce((sum, day) => sum + day, 0);
          weeklyData.push({
            week: week + 1,
            total: weekTotal,
            days: dailyData.slice(weekStart, weekEnd),
            dateRange: `${month.name} ${weekStart + 1}-${weekEnd}`
          });
        }

        monthData.teamData[member.id] = {
          monthlyTotal,
          dailyData,
          weeklyData
        };
      });

      return monthData;
    });
  };

  const [teamData, setTeamData] = useState(() => {
    const months = getMonthsByRange('6');
    return generateTeamMemberData(months);
  });

  // Team member filter functions
  const toggleTeamMember = (memberId) => {
    setSelectedTeamMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const selectAllTeamMembers = () => {
    setSelectedTeamMembers(TEAM_MEMBERS.map(m => m.id));
  };

  const clearTeamMembers = () => {
    setSelectedTeamMembers([]);
  };

  // Process team data for chart consumption
  const processedChartData = useMemo(() => {
    const activeTeamMembers = selectedTeamMembers.length > 0 
      ? TEAM_MEMBERS.filter(m => selectedTeamMembers.includes(m.id))
      : TEAM_MEMBERS;

    return teamData.map(month => {
      // Aggregate monthly totals
      const monthlyTotal = activeTeamMembers.reduce((sum, member) => {
        return sum + (month.teamData[member.id]?.monthlyTotal || 0);
      }, 0);

      // Aggregate weekly data
      const maxWeeks = Math.max(...Object.values(month.teamData).map(td => td.weeklyData.length));
      const weeklyData = [];
      
      for (let week = 0; week < maxWeeks; week++) {
        const weekTotal = activeTeamMembers.reduce((sum, member) => {
          const memberData = month.teamData[member.id];
          return sum + (memberData.weeklyData[week]?.total || 0);
        }, 0);
        
        // Aggregate daily data for this week
        const maxDaysInWeek = Math.max(...activeTeamMembers.map(member => {
          const memberData = month.teamData[member.id];
          return memberData.weeklyData[week]?.days.length || 0;
        }));
        
        const weekDays = [];
        for (let day = 0; day < maxDaysInWeek; day++) {
          const dayTotal = activeTeamMembers.reduce((sum, member) => {
            const memberData = month.teamData[member.id];
            const weekData = memberData.weeklyData[week];
            return sum + (weekData ? weekData.days[day] || 0 : 0);
          }, 0);
          weekDays.push(dayTotal);
        }
        
        weeklyData.push({
          week: week + 1,
          total: weekTotal,
          days: weekDays,
          dateRange: `${month.name} ${week * 7 + 1}-${Math.min((week + 1) * 7, month.maxDays)}`
        });
      }

      return {
        ...month,
        monthlyTotal,
        weeklyData
      };
    });
  }, [teamData, selectedTeamMembers]);

  const handleDataChange = (newData, newTimeRange) => {
    setTimeRange(newTimeRange);
    const months = getMonthsByRange(newTimeRange);
    const newTeamData = generateTeamMemberData(months);
    setTeamData(newTeamData);
  };

  const generateNewTeamData = () => {
    const months = getMonthsByRange(timeRange);
    const newTeamData = generateTeamMemberData(months);
    setTeamData(newTeamData);
  };

  // Custom actions for the chart component
  const customActions = (
    <Button 
      variant="primary" 
      size="small"
      onClick={() => setShowTeamFilter(!showTeamFilter)}
      className="ms-2"
    >
      {showTeamFilter ? 'Hide' : 'Show'} Team Filter
    </Button>
  );

  return (
    <div className="team-analytics">
      {/* Team Member Filter */}
      {showTeamFilter && (
        <div className="team-filter mb-4 p-3 border rounded">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Filter by Team Members</h5>
            <div>
              <Button variant="outline-primary" size="small" onClick={selectAllTeamMembers} className="me-2">
                Select All
              </Button>
              <Button variant="outline-secondary" size="small" onClick={clearTeamMembers}>
                Clear All
              </Button>
            </div>
          </div>
          
          <div className="row">
            {TEAM_MEMBERS.map(member => (
              <div key={member.id} className="col-md-4 col-lg-3 mb-3">
                <div className="team-member-card">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`team-${member.id}`}
                      checked={selectedTeamMembers.includes(member.id)}
                      onChange={() => toggleTeamMember(member.id)}
                    />
                    <label className="form-check-label" htmlFor={`team-${member.id}`}>
                      <div className="d-flex align-items-center">
                        <img 
                          src={member.imgUrl} 
                          alt={member.name}
                          className="team-member-avatar me-2"
                          loading="lazy"
                        />
                        <div>
                          <div className="fw-medium">{member.name}</div>
                          <small className="text-muted">{member.role}</small>
                          <br />
                          <small className="text-muted">{member.region}</small>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="filter-status mt-3">
            <small className="text-info">
              {selectedTeamMembers.length === 0 
                ? 'Showing data for all team members' 
                : `Showing aggregated data for ${selectedTeamMembers.length} selected team member(s)`}
            </small>
            {selectedTeamMembers.length > 0 && (
              <div className="selected-members mt-2">
                {TEAM_MEMBERS
                  .filter(m => selectedTeamMembers.includes(m.id))
                  .map(member => (
                    <span key={member.id} className="badge bg-primary me-1">
                      {member.firstName}
                    </span>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      )}

      <ChartComponent
        title="Team Sales Analytics"
        description="Multi-level drill-down with team member filtering and performance tracking"
        data={processedChartData}
        onDataChange={handleDataChange}
        customActions={customActions}
        showThemeToggle={true}
        showTimeRangeSelector={true}
        showChartTypeSelector={true}
      />

      <div className="mt-4">
        <h5>Team Analytics Features:</h5>
        <ul className="list-unstyled">
          <li>👥 <strong>Team Member Filtering:</strong> Filter data by individual team members</li>
          <li>📊 <strong>Aggregated Metrics:</strong> Automatic summation across selected team members</li>
          <li>🎯 <strong>Performance Tracking:</strong> Monthly, weekly, and daily performance views</li>
          <li>🔄 <strong>Real-time Updates:</strong> Dynamic chart updates based on team selection</li>
          <li>🏷️ <strong>Smart Labeling:</strong> Context-aware titles showing selected team members</li>
          <li>📈 <strong>Drill-down Analytics:</strong> Multi-level data exploration</li>
          <li>🌓 <strong>Theme Integration:</strong> Consistent with app theme system</li>
          <li>♿ <strong>Accessibility:</strong> Full ARIA support and keyboard navigation</li>
        </ul>
      </div>
    </div>
  );
};

export default TeamAnalytics;