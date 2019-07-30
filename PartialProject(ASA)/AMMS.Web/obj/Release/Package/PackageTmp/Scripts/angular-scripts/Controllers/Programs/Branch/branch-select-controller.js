ammsAng.controller('branchSelectController', [
    '$scope', '$rootScope', '$q', 'authService', 'employeeService', 'branchService', 'workingDayService', 'commonService',
    function ($scope, $rootScope, $q, authService, employeeService, branchService, workingDayService, commonService) {

        $scope.branchList = {};
        $scope.currentUser = {};
        $scope.allZones = [];
        $scope.allDistricts = [];
        $scope.allRegions = [];
        $scope.allBranches = [];
        $scope.allDistrictsForSelectBox = [];
        $scope.allRegionsForSelectBox = [];
        $scope.allBranchesForSelectBox = [];
        $scope.branchSelector = {selectedBranchName: ''};
        $rootScope.isDisabledAsif = false;
        $rootScope.dataLoadedFirstTime = false;

        $scope.init = function () {
            //$("#loadingImage").css("display", "block");
            authService.get().then(function (response) {
                console.log(response.data);
                $rootScope.user = response.data;
                if ($rootScope.user.UserId === '40') $rootScope.enableAsifBetaCode = false;
                

                Encrypt.key = CryptoJS.enc.Utf8.parse(response.data.ApiKey);
                Encrypt.key = CryptoJS.enc.Utf8.parse(response.data.ApiKey);
                Encrypt.iv = CryptoJS.enc.Utf8.parse(response.data.ApiIv);
                $rootScope.setHeaders();
                $q.all([$scope.getAllBranch(), $scope.getEmployeeData()]).then(function (arrayOfResults) {
                    $scope.branchList = arrayOfResults[0].data;
                    $rootScope.branchList = $scope.branchList;
                   // Console.log($rootScope.branchList);
                    $scope.currentUser = JSON.parse(arrayOfResults[1].data);
                    $scope.currentUser.BranchId = $scope.currentUser.CurrentBranchId;
                    console.log(arrayOfResults[0].data);
                    $scope.filterBranch();
                    $scope.createDropDownData();
                    $scope.setSelectedValue();
                }, AMMS.handleServiceError);

            }, AMMS.handleServiceError);
        }

        $scope.init();

        var getSystemDate = function () {
            commonService.getServerDateTime().then(function (response) {
                $rootScope.systemDateTime = response.data;
                console.log($rootScope.systemDateTime);

            });
        }

        $scope.filterBranch = function () {
            getSystemDate();
            switch ($rootScope.user.Role) {
                case $rootScope.UserRole.SuperAdmin:
                case $rootScope.UserRole.Admin:
                    {
                        break;
                    }
                case $rootScope.UserRole.ZM:
                    {
                        $scope.branchList = $scope.branchList.filter(
                            branch => branch.ZoneId === $scope.currentUser.ZoneId);
                        break;
                    }
                case $rootScope.UserRole.DM:
                    {
                        $scope.branchList = $scope.branchList.filter(
                            branch => branch.DistrictId === $scope.currentUser.DistrictId);
                        break;
                    }
                case $rootScope.UserRole.RM:
                    {
                        $scope.branchList = $scope.branchList.filter(
                            branch => branch.RegionId === $scope.currentUser.RegionId);
                        break;
                    }
                case $rootScope.UserRole.LO:
                case $rootScope.UserRole.BM:
                case $rootScope.UserRole.HRAdmin:
                    {
                        $scope.branchList = $scope.branchList.filter(
                            branch => branch.BranchId === $scope.currentUser.BranchId);
                        break;
                    }
                default:
                    {
                        $scope.branchList = $scope.branchList.filter(
                        branch => branch.BranchId === $scope.currentUser.BranchId);
                        break;
                    }
            }
        }

        $scope.createDropDownData = function () {
            $scope.allZones = $scope.branchList.filter((branch, index, self) => self.findIndex((t) => {
                return t.ZoneId === branch.ZoneId;
            }) === index);
            $scope.allZones = $scope.allZones.sort((a, b) => a.ZoneName.localeCompare(b.ZoneName));
            $scope.allDistricts = $scope.branchList.filter((branch, index, self) => self.findIndex((t) => {
                return t.DistrictId === branch.DistrictId;
            }) === index).sort((a, b) => a.DistrictName.localeCompare(b.DistrictName));
            $scope.allRegions = $scope.branchList.filter((branch, index, self) => self.findIndex((t) => {
                return t.RegionId === branch.RegionId;
            }) === index).sort((a, b) => a.RegionName.localeCompare(b.RegionName));
            $scope.allBranches = $scope.branchList.sort((a, b) => a.BranchName.localeCompare(b.BranchName));
        }



        $scope.getEmployeeData = function () {
            return employeeService.getEmployeeShort($rootScope.user.EmployeeId);
        }


        $scope.getAllBranch = function () {
            return branchService.getAllBranch();
        }

        $scope.setSelectedValue = function () {
            $scope.branchSelector.selectedZone = $scope.currentUser.ZoneId;
            $scope.setDistrict($scope.branchSelector.selectedZone);
        }

        $scope.setDistrict = function (zoneId, fromView) {
            console.log($scope.allDistricts, zoneId, $scope.allDistrictsForSelectBox);
            $scope.allDistrictsForSelectBox = $scope.allDistricts.filter(district => district.ZoneId === zoneId);
            if (fromView !== undefined) $scope.branchSelector.selectedDistrict = $scope.allDistrictsForSelectBox[0].DistrictId;
            else $scope.branchSelector.selectedDistrict = $scope.currentUser.DistrictId;
            $rootScope.selectedDistrictId = $scope.branchSelector.selectedDistrict;

            $rootScope.selectedDistricObject = $scope.allDistrictsForSelectBox.filter(d => d.DistrictId === $scope.branchSelector.selectedDistrict)[0];

            $scope.setRegion($scope.branchSelector.selectedDistrict, fromView);

            if ($rootScope.enableAsifBetaCode && $rootScope.env === "dev") {
                var zoneCached = sessionStorage.getItem('selectedZone');
                if (zoneCached !== undefined && fromView === undefined) {
                    $scope.branchSelector.selectedZone = parseInt(zoneCached);
                    $scope.allDistrictsForSelectBox = $scope.allDistricts.filter(district => district.ZoneId === parseInt(zoneCached));
                }
                else sessionStorage.setItem('selectedZone', zoneId);
             }

        }

        $scope.setRegion = function (districtId, fromView) {
            $rootScope.selectedDistrictId = $scope.branchSelector.selectedDistrict;
            $scope.allRegionsForSelectBox = $scope.allRegions.filter(region => region.DistrictId === districtId);
            if (fromView !== undefined) $scope.branchSelector.selectedRegion = $scope.allRegionsForSelectBox[0].RegionId;
            else $scope.branchSelector.selectedRegion = $scope.currentUser.RegionId;
            $scope.setBranch($scope.branchSelector.selectedRegion, fromView);

            if ($rootScope.enableAsifBetaCode && $rootScope.env === "dev") {
                var districtCached = sessionStorage.getItem('selectedDistrict');
                if (districtCached !== undefined && fromView === undefined) {
                    $scope.branchSelector.selectedDistrict = parseInt(districtCached);
                    $scope.allRegionsForSelectBox = $scope.allRegions.filter(region => region.DistrictId === parseInt(districtCached));
                }
                else sessionStorage.setItem('selectedDistrict', districtId);

            }
        }

        $scope.setBranch = function (regionId, fromView) {
            $rootScope.dataLoadedFirstTime = false;
            $scope.allBranchesForSelectBox = $scope.allBranches.filter(branch => branch.RegionId === regionId);
            if (fromView !== undefined) {
                $scope.allBranchesForSelectBox.push({
                    BranchId: -5,
                    BranchName: "Please Select Branch",
                    DistrictId: 72,
                    DistrictName: "Bogra",
                    RegionId: 231,
                    RegionName: "Bogra",
                    ZoneId: 55,
                    ZoneName: "Bogra"
                });


                $scope.branchSelector.selectedBranch = $scope.allBranchesForSelectBox[$scope.allBranchesForSelectBox.length - 1].BranchId;
            }
            else $scope.branchSelector.selectedBranch = $scope.currentUser.BranchId;


            //asif
            if ($rootScope.enableAsifBetaCode && $rootScope.env === "dev") {
                var regionCached = sessionStorage.getItem('selectedRegion');
                if (regionCached !== undefined && fromView === undefined) {
                    $scope.branchSelector.selectedRegion = parseInt(regionCached);
                    $scope.allBranchesForSelectBox = $scope.allBranches.filter(region => region.RegionId === parseInt(regionCached));
                }
                else sessionStorage.setItem('selectedRegion', regionId);
             }

            var branches = $scope.allBranchesForSelectBox.filter(d => d.BranchId === $scope.branchSelector.selectedBranch);
            $scope.branchSelector.selectedBranchName = branches && branches.length > 0 ? branches[0].BranchName : '';
            $rootScope.isDisabledAsif = false;
            $scope.setProgramOfficer($scope.branchSelector.selectedBranch);
            //$rootScope.getBranchesByRoleAndBranch();

        }

        $scope.cacheBranch = function(branchId , fromView) {
            if ($rootScope.enableAsifBetaCode && $rootScope.env === "dev") {
                var branchCached = sessionStorage.getItem('selectedBranch');
                if (branchCached !== undefined && branchCached!== null && fromView === undefined) {
                    $scope.branchSelector.selectedBranch = parseInt(branchCached);
                }
                else sessionStorage.setItem('selectedBranch', branchId);

                console.log($scope.branchSelector);
                console.log($scope.currentUser);
                if (isNaN($scope.branchSelector.selectedRegion)) {
                   
                    console.log($scope.allZones);
                    $scope.branchSelector.selectedZone = $scope.currentUser.ZoneId;
                    $scope.setDistrict($scope.branchSelector.selectedZone, 1); $scope.getDistrictObject();
                    $scope.branchSelector.selectedDistrict = $scope.currentUser.DistrictId;
                    $scope.setRegion($scope.branchSelector.selectedDistrict, 1); $scope.getDistrictObject();
                    $scope.branchSelector.selectedRegion = $scope.currentUser.RegionId;
                    $scope.setBranch($scope.branchSelector.selectedRegion, 1);
                    $scope.branchSelector.selectedBranch = $scope.currentUser.CurrentBranchId;
                    //$scope.setProgramOfficer($scope.branchSelector.selectedBranch);
                }

            }
            
        }






        $scope.getDistrictObject = function () {
            $rootScope.selectedDistricObject = $scope.allDistrictsForSelectBox.filter(d => d.DistrictId === $scope.branchSelector.selectedDistrict)[0];
        }

        $scope.setProgramOfficer = function (branchId) {
            if (branchId === -1) {
                $scope.cacheBranch(branchId, undefined);
                branchId = $scope.branchSelector.selectedBranch;
            } else {
                $scope.cacheBranch(branchId, 1);
               
            }




            if (branchId === -5) {
               
                return;
            }
            var branches = $scope.allBranchesForSelectBox.filter(d => d.BranchId === branchId);
            $scope.branchSelector.selectedBranchName = branches && branches.length > 0 ? branches[0].BranchName : '';
           // $rootScope.dataLoadedFirstTime = false;
            console.log(branchId);
            $scope.removeAllTabinDayOpenClose();
            $rootScope.selectedBranchTitle = $scope.allBranches.filter(function (branch) {
                return branch.BranchId === branchId;
            })[0].BranchName;
            $rootScope.selectedBranchId = $scope.allBranches.filter(function (branch) {
                return branch.BranchId === branchId;
            })[0].BranchId;
            $scope.getWorkingDay(branchId);
            if ($rootScope.selectedBranchId === 1)
                $rootScope.IsHeadOffice = true;
            else $rootScope.IsHeadOffice = false;
            

        }
        $scope.getProgramOfficerOfBranch = function (branchId) {
            employeeService.getProgramOfficerOfBranch(branchId).success(function (response) {
                $("#branchloadingImage").css("display", "block");
                //$scope.getMenus();
                if ($rootScope.user.Role === $rootScope.UserRole.LO || $rootScope.user.Role === $rootScope.UserRole.HRAdmin
                     || $rootScope.user.Role === $rootScope.UserRole.ABM) {
                    response = response.filter(
                            user => user.Id.toString() === $rootScope.user.EmployeeId);
                }
                $rootScope.$broadcast('program-officer-fetched', response, branchId);
                console.log(response);

               // $("#loadingImage").css("display", "none");
            }).error(function (response, data) {
                console.log(data, status);
            });
        }

        $scope.getWorkingDay = function (branchId) {
            workingDayService.getDateOfBranch(branchId).then(function (response) {
                $rootScope.displayDate = commonService.intToDate(response.data.date);
                $rootScope.workingdate = moment(response.data.date.toString().slice(0, 8)).toDate();
                $rootScope.workingdateInt = response.data.date;
                $rootScope.workingdateIsOpened = response.data.status;
                $rootScope.$broadcast('working-day-fetched');

                $scope.getProgramOfficerOfBranch(branchId);
            });
        }

        var resetAmms = function () {
            $scope.tabs.length = 0;
            $scope.menus.length = 0;
            $scope.extraTabs.length = 0;
            $scope.extraTabIds.length = 0;
            $scope.showExtraTabList = false;
            $scope.openWindows.length = 0;
            $scope.officer.length = 0;
            $scope.selectedBranchId = null;
            $scope.groupIds.length = 0;
        }


    }]);