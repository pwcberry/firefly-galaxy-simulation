import numpy as np
import math
from euclid import *

def setCenterOfMassView(pos, mass,distanceRatio):
    # global cameraPosition
    #global pivotPoint, cameraPosition, cameraOrientation
    center = np.average(pos,0,np.ravel(mass))
    pivPoint = Vector3(center[0],center[1],center[2])
    std = np.std(pos,0)
    zZoom = std[2] * distanceRatio
    print "Dist ratio: " + str(distanceRatio) + " :zZoom: " + str(zZoom)
    #print zZoom
    camPos = Vector3(center[0] + zZoom,center[1] + zZoom ,center[2] + zZoom)
    print camPos
    camOrientation = Quaternion()
    #print cameraOrientation
    return camPos, pivPoint, camOrientation

def setDefaultRanges(val):
    center = np.average(np.ravel(val))
    std = np.std(np.ravel(val))
    minB = center - (std * 1)
    maxB = 1
    print str(minB) + ": " + str(maxB)
    return minB, maxB

def setDefaultDec(val):
    pass

def setDefaultPointScale(sizeNPArray):
    global pointScale
    pointScale = 1.0
    average = np.average(np.ravel(sizeNPArray))
    print "Average point size: " + str(average)